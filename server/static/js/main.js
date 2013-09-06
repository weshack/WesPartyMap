var map;
var heatmap;

var loadPoints = function(){
	$.getJSON("/checkins").done(function(response){
		ret = [];
		for (var i = 0; i < response.length; i++){
			ret.push(new google.maps.LatLng(response[i]['latitude'],response[i]['longitude']));
		}
		var pointArray = new google.maps.MVCArray(ret);
		console.log("We have " + pointArray.length + " points loaded.")
    	heatmap.setData(pointArray);
	});
};

$(function(){
    var mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(41.555, -72.65957),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    heatmap = new google.maps.visualization.HeatmapLayer();
    heatmap.setMap(map);
    heatmap.setOptions({
    	radius: 10,
    	maxIntensity: 20
    });
    loadPoints();
    $.getJSON("/static/json/polygons.json").done(function(response){
		for (var i = 0; i < response.length; i++) {
			var coords = response[i]['coordinates']
			var areaPaths = coords.map(function(pt,ind,arr){
				return new google.maps.LatLng(pt[1],pt[0]);
			})
			var p = new google.maps.Polygon({
				paths: areaPaths,
				fillColor: 'rgba(0,0,0,0)',
				strokeColor: 'rgba(0,0,0,0)',
				map: map
			});
			(function (name){
				google.maps.event.addListener(p, 'click', function(){
					console.log(name)
					$("#info-pane").css('left','')
					setTimeout(function(){
						$("#info-pane").css('left', '80%')
						$("#info-pane .name").html(name)
					}, 1000);
				});
			})(response[i]['name']);
		}
	});
});