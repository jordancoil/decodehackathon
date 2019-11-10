#!/usr/bin/python3
# run export SUMO_HOME=⁨/usr⁩/local⁩/Cellar⁩/⁨sumo⁩/⁨1.3.1⁩/⁨share⁩/sumo/

import os
import sys
import optparse
import csv

# we need to import some python modules from the $SUMO_HOME/tools directory
if 'SUMO_HOME' in os.environ:
    tools = os.path.join(os.environ['SUMO_HOME'], 'tools')
    sys.path.append(tools)
    print(tools)
else:
    sys.exit("please declare environment variable 'SUMO_HOME'")

print(sys.path)
from sumolib import checkBinary  # Checks for the binary in environ vars
import traci


def get_options():
    opt_parser = optparse.OptionParser()
    opt_parser.add_option("--nogui", action="store_true",
                         default=False, help="run the commandline version of sumo")
    options, args = opt_parser.parse_args()
    return options


# contains TraCI control loop
def run():

    # busRecords = [[0]*200]*720 # We will collect buses on network
    busRecords = []
    step = 0

    while traci.simulation.getMinExpectedNumber() > 0:
        traci.simulationStep(step*1.0)
        vehicles = traci.vehicle.getIDList()
        busRecords.append(vehicles)
        print(len(busRecords))
        # print(vehicles)
        # buses = []
        # n = len(vehicles)
        # for i in vehicles:
        #     j = 0
        #     if traci.vehicle.getTypeID(i) == 'bus':
        #         #print(j)
        #         busRecords[int(step/5),j] = i
        #         j+=1

        # for veh in det_vehs:
        #     print(veh)
        #     traci.vehicle.changeLane(veh, 2, 25)

        # if step == 100:
        #     traci.vehicle.changeTarget("1", "e9")
        #     traci.vehicle.changeTarget("3", "e9")

        step += 5

    with open('vehicles.csv', 'w', newline='') as csvfile:
        awriter = csv.writer(csvfile, delimiter=' ',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
        for i in busRecords:
            awriter.writerow(i)

    traci.close()
    sys.stdout.flush()


# main entry point
if __name__ == "__main__":
    options = get_options()

    # check binary
    if options.nogui:
        sumoBinary = checkBinary('sumo')
    else:
        sumoBinary = checkBinary('sumo-gui')

    # traci starts sumo as a subprocess and then this script connects and runs
    traci.start([sumoBinary, "-c", "osm.sumocfg",
                             "--tripinfo-output", "tripinfo.xml"])
    run()
