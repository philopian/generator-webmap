
//-----Map Settings-----------------------------------	
	var map = L.map('map', {
		center: [45.5200, -122.6819],
		zoom: 10
	});
	new L.tileLayer('<%= YOUR_BASEMAP %>').addTo(map);

