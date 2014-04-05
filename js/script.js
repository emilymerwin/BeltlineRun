(function() {
	var markers = [], btnTxt = document.getElementById('cycle'), currentSlide = 0, timer, touring;
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

	var lineLayer = L.mapbox.featureLayer()
		.loadURL('data/lines.geojson')
		.addTo(map);

	//different styles for planned segments vs open segments
	lineLayer.on('ready', function() {
		var style = function(layer) {
			if (layer.feature.properties.className === 'planned'){
				return { dashArray: "8,12", lineCap: "square", opacity: .8 };
			}
		}
 		this.eachLayer(function(layer){
			layer.setStyle(style(layer));
		});
	});

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
			prop.caption = prop.caption || " ";
			var content;
			if (docwidth<400){
				content = '<img src="'+prop.image+'" style="width:270px"/>';
				layer.bindPopup(content, {maxWidth: prop.width, minHeight: prop.height});
			} else {
				content = '<img src="'+prop.image+'" style="height:'+prop.height+'; width:'+prop.width+'"/><p>'+prop.caption +'</p>';
				layer.bindPopup(content, {maxWidth: prop.width, minHeight: prop.height});
			}
			markers.push(layer);
			prop.id = markers.length;
			/*//if the tour has been started or paused, resume tour from active marker
			//this doesnt work because this array hasn't been sorted by date - so they will be in a different order
			layer.on('click', function() {
				if(currentSlide){
					currentSlide = prop.id;
				}
			});*/
		});
		markers.sort(chronoSort);
	});

	function cycle(markers) {
		function run() {
			map.setView(markers[currentSlide].getLatLng(), 15);
			markers[currentSlide].openPopup();
			timer = window.setTimeout(run, 4000);
			if (++currentSlide > markers.length - 1) i = 0;
		}
		if(!touring){
			run();
			touring = true;
			btnTxt.innerHTML = "Pause tour";
		} else {
			window.clearTimeout(timer);
			touring = false;
			btnTxt.innerHTML = "Resume tour";
		}
	 }//cycle

	//sort markers by timestamp
	function chronoSort(a, b) {
		return a.feature.properties.date.getTime() - b.feature.properties.date.getTime();
	}

	//currently not in use because of weird timezone thing on mobile
	/*function reformatTimestamp(timestamp) {
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
	}//reformatTimestamp*/

	document.getElementById("map-ui").onclick = function(){
		//automatically move through points and trigger popups (but first sort into chronological order)
		cycle(markers);
	}
}());