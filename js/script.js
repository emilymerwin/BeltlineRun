(function() {
	var markers = [], btnTxt = document.getElementById('cycle'), currentSlide = 0, timer, touring, docwidth = document.body.clientWidth;

	var map = L.map('map').setView([33.768682989507914, -84.36510918661952], 13);
	L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>, Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
		maxZoom: 18
	}).addTo(map);
	
	var legend; 
	if(docwidth < 400){
		legend = L.control({position: 'bottomright'});
	} else {
		legend = L.control({position: 'topright'});
	}
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend');
		div.innerHTML += '<i class="open"></i>Open <br><i class="planned"></i><i class="planned"></i><span class="label">Planned</span><br><img style="" src="css/blue.png" /><span class="label"> Running tour</span><br><img src="css/orange.png" /><span class="label"> Points of interest</span>'
	    return div;
	};
	legend.addTo(map);

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
			} else {
				return { lineCap: "butt" };
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

	featureLayer.on('ready', function(){
		this.eachLayer(function(layer){
			var content = '<span class="leaflet-popup-close-button" id="close">×</span>',
			prop = layer.feature.properties;
			prop.date = new Date(prop.date);
			prop.caption = prop.caption || " ";
			//Popup options: set dimensions of images/popups so they will autosize/autopan appropriately. Disable default close btn bc has no #ID, no jQuery and we need to listen for it in 'tour' mode. Listening for 'popupclose' won't work bc it will also be fired when closing one popup to open another, which happens on each marker during tour
			if (docwidth<400){
				content += '<img src="'+prop.image+'" style="width:270px"/>';
			} else {
				content += '<img src="'+prop.image+'" style="height:'+prop.height+'; width:'+prop.width+'"/><p>'+prop.caption +'</p>';
			}
			layer.bindPopup(content, {closeButton: false, maxWidth: prop.width, minHeight: prop.height});
			markers.push(layer);
			//if the tour has been started or paused, resume tour from active marker
			layer.on('click', function() {
				if(currentSlide){
					currentSlide = markers.indexOf(layer);
				}
			});
		});
		//sort markers by timestamp so they will be in order for "tour"
		markers.sort(function (a, b) {
			return a.feature.properties.date.getTime() - b.feature.properties.date.getTime();
		});
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
			pauseTour();
		}
	 }//cycle

	 function pauseTour(){
		 window.clearTimeout(timer);
		 touring = false;
		 btnTxt.innerHTML = "Resume tour";
	 }

	 map.on("popupopen", function(){
		 document.getElementById("close").onclick = function(){
			 map.closePopup();
			 if(touring){
				 pauseTour();
			 }
		 }
	 });
	 map.on("click", function(){
		 if(touring){
			 pauseTour();
		 }
	 });
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
		//automatically move through points and trigger popups
		cycle(markers);
	}
}());