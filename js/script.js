//(function() { //commented so I can access vars in development
	var map = L.map('map').setView([33.768682989507914, -84.36510918661952], 13);
	L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>, Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
		maxZoom: 18
	}).addTo(map);
	
	//add GeoJSON to map as a layer
	var featureLayer = L.mapbox.featureLayer()
	    .loadURL('data/map.geojson')
	    .addTo(map);

	featureLayer.on('ready', function(){
		var markers = [];
		this.eachLayer(function(layer){
			var prop = layer.feature.properties,
	    content = '<img src="'+prop.image+'" style="height:'+prop.height+'; width:'+prop.width+'"/><h1>size: ' + prop.date + '<\/h1>';
	    layer.bindPopup(content, {maxWidth: prop.width, height: prop.height});
			markers.push(layer);
		});
		cycle(markers)
	});
	
	function cycle(markers) {
	    var i = 0;
	    function run() {
	        if (++i > markers.length - 1) i = 0;
	        map.setView(markers[i].getLatLng(), 12);
	        markers[i].openPopup();
	        window.setTimeout(run, 3000);
	    }
	    run();
	}
//}());