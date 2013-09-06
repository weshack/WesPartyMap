var currentPoints = []

var loadPoints = function(){
	$.getJSON("/checkins").done(function(response){
		ret = [];
		for (var i = 0; i < response.length; i++){
			ret.push(new google.maps.LatLng(response[i]['latitude'],response[i]['longitude']));
		}
		currentPoints = ret;
	});
};

$(function(){
	var map, pointarray, heatmap;
	loadPoints();
    var mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(41.555, -72.65957),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    var pointArray = new google.maps.MVCArray(currentPoints);
    heatmap = new google.maps.visualization.HeatmapLayer({
    	data: pointArray
    });
    heatmap.setMap(map)
});