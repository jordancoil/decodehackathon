#!/bin/bash
python "$SUMO_HOME/tools/ptlines2flows.py" -n osm.net.xml -e 3600 -p 600 --random-begin --seed 42 --ptstops osm_stops.add.xml --ptlines osm_ptlines.xml -o osm_pt.rou.xml --ignore-errors --vtype-prefix pt_ --stopinfos-file stopinfos.xml --routes-file vehroutes.xml --trips-file trips.trips.xml --verbose


python "$SUMO_HOME/tools/randomTrips.py" -n osm.net.xml --seed 42 --fringe-factor 5 -p 2.751111 -o osm.passenger.trips.xml -e 3600 --vehicle-class passenger --vclass passenger --prefix veh --min-distance 300 --trip-attributes 'departLane="best"' --fringe-start-attributes 'departSpeed="max"' --allow-fringe.min-length 1000 --lanes --validate

python "$SUMO_HOME/tools/randomTrips.py" -n osm.net.xml --seed 42 --fringe-factor 5 -p 16.506668 -o osm.bus.trips.xml -e 3600 --vehicle-class bus --vclass bus --prefix bus --min-distance 600 --fringe-start-attributes 'departSpeed="max"' --trip-attributes 'departLane="best"' --validate
