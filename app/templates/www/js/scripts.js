
//-----Map Settings-----------------------------------	
	var map = L.map('map', {
		center: [45.5200, -122.6819],
		zoom: 10
	});
	new L.tileLayer('https://{s}.tiles.mapbox.com/v3/examples.map-20v6611k/{z}/{x}/{y}.png').addTo(map);

