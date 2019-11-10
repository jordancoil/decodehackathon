var baseMapLayer = new ol.layer.Tile({
  source: new ol.source.OSM()
})

var view = new ol.View({
  center: ol.proj.fromLonLat([-123.182615, 49.260227]),
  zoom: 13
})

var map = new ol.Map({
  target: 'mapdiv',
  layers: [baseMapLayer],
  view: view
});

function createMarker(id, lon, lat, name, avgbus, cars, peds, policy) {

  var marker = new ol.Feature({
    geometry: new ol.geom.Point(
      ol.proj.fromLonLat([lon, lat])
    ),
  })

  var circle = makeCircle(lon, lat)

  circle.displayInfo = function() {
    zoom(ol.proj.fromLonLat([lon + 0.0075, lat]));
    intersectionInfo(id, name, avgbus, cars, peds, policy)
  }

  var image;
  if (policy == "bus") {
    image = 'vendor/fontawesome-free/svgs/solid/bus.svg';
  } else if (policy == "ped") {
    image = 'vendor/fontawesome-free/svgs/solid/walking.svg';
  } else if (policy == "bike") {
    image = 'vendor/fontawesome-free/svgs/solid/biking.svg';
  }

  marker.setStyle(new ol.style.Style({
    image: new ol.style.Icon(({
      color: '#0079B1',
      crossOrigin: 'anonymous',
      scale: 0.15,
      opacity: 1,
      src: image
    }))
  }))

  return marker
}

map.on('click', function(event) {
  map.forEachFeatureAtPixel(event.pixel, function(feature, layer) {
    feature.displayInfo();
  });
});

// Initialize markers
function initMarkers() {
  var markers = [];

  for (var key in intersections) {
    var inter = intersections[key];
    var newmarker = createMarker(
      inter.id,
      inter.lon,
      inter.lat,
      inter.name,
      inter.avgbuswait,
      inter.cars,
      inter.peds,
      inter.policy
    );

    markers.push(newmarker)
  }

  var vectorSource = new ol.source.Vector({
    features: markers
  })

  var markerVectorLayer = new ol.layer.Vector({
    source: vectorSource
  });

  map.addLayer(markerVectorLayer);
}

initMarkers();

function zoom(center){
  view.animate({
    center: center,
    zoom: 15
  });
}

$(document).on("click", ".simulate-policy", function() {

  $(".stats table").fadeOut(500)
  setTimeout(function() {
    $(".stats .spinner-border").fadeIn(500)

    setTimeout(function() {
      var $stats_table = $(".stats table");
      var $stats_table_body = $(".stats table tbody");
      var $table_rows  = $(".stats table tr")

      var new_head = document.createElement('th')
      new_head.innerHTML = "Simulated"
      new_head.setAttribute("class", "simulated")

      var new_avgbus = document.createElement('td')
      new_avgbus.innerHTML = "10s"
      new_avgbus.setAttribute("class", "text-success simulated")

      var new_cars = document.createElement('td')
      new_cars.innerHTML = "360"
      new_cars.setAttribute("class", "text-success simulated")

      var new_peds = document.createElement('td')
      new_peds.innerHTML = "180"
      new_peds.setAttribute("class", "text-success simulated")

      $table_rows[0].append(new_head)
      $table_rows[1].append(new_avgbus)
      $table_rows[2].append(new_cars)
      $table_rows[3].append(new_peds)

      var new_btn = document.createElement('button')
      new_btn.innerHTML = "Clear Simulations"
      new_btn.setAttribute("class", "btn btn-light simulated clear-simulated")
      $stats_table.append(new_btn);

      $(".stats .spinner-border").fadeOut(500)

      setTimeout(function() {
        $(".stats table").fadeIn(500)
      }, 500)

    }, 2000)

  }, 500)

});

$(document).on("click", ".clear-simulated", function() {
  $(".simulated").remove();
});

$(document).on("click", ".close-sidebar", function() {
  $("#graph-sidebar").addClass("collapsed");
});

$(document).on("change", "#policy-select", function(ev) {
  var new_policy = $("#policy-select option:selected").val();
  var form = this.parentElement.parentElement
  var iid = form.dataset.intersection_id
  intersections[iid].policy = new_policy;

  initMarkers();
});



// ---------
// FUNCTIONS
function makeCircle(lon, lat) {

  var vectorSource = new ol.source.Vector();
  var vectorLayer = new ol.layer.Vector({
    source: vectorSource
  });

  var circle = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 20,
      fill: new ol.style.Fill({
        color: "#ffffff"
      }),
      stroke: new ol.style.Stroke({
        color: '#0079B1',
        width: 3
      })
    })
  });

  var feature = new ol.Feature({
    geometry: new ol.geom.Point(
      ol.proj.fromLonLat([lon, lat])),
    });

  feature.setStyle(circle);
  vectorSource.addFeature(feature);

  map.addLayer(vectorLayer);

  return feature;
}

// Function to display stats about the intersection
function intersectionInfo(id, name, avgbus, cars, peds, policy){
  var busselected = "",
      pedselected = "",
      bikselected = "";
  if (policy == "bus") {
    busselected = 'selected';
  } else if (policy == "ped") {
    pedselected = 'selected';
  } else if (policy == "bike") {
    bikselected = 'selected';
  }
  var info = `
    <h3>`+name+`</h3>
    <hr/>
    <form data-intersection_id="`+id+`">
      <div class="form-group">
        <h5 class="text-gray-900" for="policy-select">Policy:</h5>
        <select class="form-control" id="policy-select">
          <option value="bus" `+busselected+`>Bus</option>
          <option value="ped" `+pedselected+`>Pedestrian</option>
          <option value="bike" `+bikselected+`>Bicycle</option>
        </select>
      </div>
      <div class="form-group">
        <h5 class="text-gray-900">Deployed On:</h5>
        <p class="text-secondary">October 14th 2019</p>
      </div>
    </form>

    <div><button class="btn btn-primary deploy-policy mb-3" style="display:block; width:100%">Deploy New Policy</button></div>
    <div><button class="btn btn-success simulate-policy" style="display:block; width:100%">Simulate New Policy</button></div>

    <div class="stats">
      <h5 class="text-gray-900">Stats</h5>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Metric</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td scope="row">Avg. Bus Wait Time</td>
            <td>`+avgbus+`</td>
          </tr>
          <tr>
            <td scope="row">Peak Hour Vehicle Volume</td>
            <td>`+cars+`</td>
          </tr>
          <tr>
            <td scope="row">Peak Hour Pedestrian Volume</td>
            <td>`+peds+`</td>
          </tr>
        </tbody>
      </table>
      <div class="text-center">
        <div class="spinner-border" style="display: none;"></div>
      </div>
    </div>`

  $('#graph-sidebar .sidebar-target').html(info)
  $('#graph-sidebar').removeClass("collapsed")
}
