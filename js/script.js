(function() {
	var markers = [], ui = document.getElementById('map-ui');
	var map = L.map('map').setView([33.768682989507914, -84.36510918661952], 13);
	L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>, Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
		maxZoom: 18
	}).addTo(map);
	
	//add GeoJSON to map as a layer
	var featureLayer = L.mapbox.featureLayer()
		.loadURL('data/map.geojson')
		.addTo(map);

	var jillLayer = L.mapbox.featureLayer()
		.loadURL('data/jill.geojson')
		.addTo(map);

	jillLayer.on('ready', function(){
		this.eachLayer(function(layer){
			var content = '<p>' + layer.feature.properties.text+'<\/p>';
			layer.bindPopup(content);
		});
	});

	var docwidth = document.body.clientWidth;

	featureLayer.on('ready', function(){
		this.eachLayer(function(layer){
			var prop = layer.feature.properties;
			prop.date = new Date(prop.date);
			var content;
			if (docwidth<400){
				content = '<img src="'+prop.image+'" style="width:270px"/>';
				layer.bindPopup(content, {maxWidth: prop.width, minHeight: prop.height});
			} else {
				content = '<img src="'+prop.image+'" style="height:'+prop.height+'; width:'+prop.width+'"/>';
				layer.bindPopup(content, {maxWidth: prop.width, minHeight: prop.height});
			}

			markers.push(layer);
		});
	});

	function cycle(markers) {
		var i = 0;
		function run() {
			if (++i > markers.length - 1) i = 0;
			map.setView(markers[i].getLatLng(), 15);
			markers[i].openPopup();
			window.setTimeout(run, 4000);
		}
		 run();
	 }//cycle

	//sort markers by timestamp
	function chronoSort(a, b) {
		return a.feature.properties.date.getTime() - b.feature.properties.date.getTime();
	}//comp

	function reformatTimestamp(timestamp) {
		var formattedTime = setTimeFormat(timestamp.getHours()) + ":" + showZeroFilled(timestamp.getMinutes()) + setAmPm(timestamp);

		function setTimeFormat(passedHour) {
			if (passedHour > 0 && passedHour < 13) {
				if (passedHour === "0") passedHour = 12;
				return (passedHour);
			}
			if (passedHour == 0) {
				return (12);
			}
			return (passedHour-12);
		}
		function showZeroFilled(inValue) {
			if (inValue > 9) {
				return "" + inValue;
			}
			return "0" + inValue;
		}
		function setAmPm(timestamp) {
			if (timestamp.getHours() < 12) {
				return (" a.m.");
			}
			return (" p.m.");
		}
		return(formattedTime);
	}//reformatTimestamp

	document.getElementById("cycle").onclick = function(){
		//automatically move through points and trigger popups (but first sort into chronological order)
		cycle(markers.sort(chronoSort));
	}
}());