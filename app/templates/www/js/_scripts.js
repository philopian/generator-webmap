
//-----Map Settings-----------------------------------	
	var map = L.map('map', {
		center: [<%= MAP_CENTER %>],
		zoom: 10
	});
	new L.tileLayer('<%= YOUR_BASEMAP %>').addTo(map);

