var map;
var heatmap;
var pointArray;

var samplePts = [];
for (var i = 0; i < 10; i++){
    samplePts.push({latitude:41.5558487388, longitude:-72.6585519627, time:new Date().getTime()});
}

for (var i = 0; i < 5; i++){
    samplePts.push({latitude:41.5558487388, longitude:-72.6585519627, time:new Date().getTime() - 20*60000});
}

for (var i = 0; i < 4; i++){
    samplePts.push({latitude:41.5558487388, longitude:-72.6585519627, time:new Date().getTime() - 32*60000});
}

for (var i = 0; i < 3; i++){
    samplePts.push({latitude:41.5558487388, longitude:-72.6585519627, time:new Date().getTime() - 40*60000});
}


for (var i = 0; i < 7; i++){
    samplePts.push({latitude:41.5558487388, longitude:-72.6585519627, time:new Date().getTime() - 12*60000});
}

//Lat Long of foss --> (41.555, -72.65838)

var loadPoints = function(){
	$.getJSON("/checkins").done(function(response){
		ret = [];
		for (var i = 0; i < response.length; i++){
			ret.push(new google.maps.LatLng(response[i]['latitude'],response[i]['longitude']));
		}
                pointArray = response;
		console.log("We have " + pointArray.length + " points loaded.")
    	heatmap.setData(new google.maps.MVCArray(ret));
	});
};

var plotPoints = function(context, poly){
    
    xs = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110]
    ys = [0,0,0,0,0,0,0,0,0,0,0,0,0]

    for (var i = 0; i < samplePts.length; i++){
        pt = samplePts[i]
        if (poly.containsLatLng(new google.maps.LatLng(pt.latitude, pt.longitude))){
            minBefore = Math.floor((new Date().getTime() - pt.time)/60000/10)*10
            ys[minBefore/10] += 1; 
        }
    }
    console.log(ys);
}

var drawScreen = function (context, poly) {
    context.fillStyle = "#ffffff";
    context.fillRect(0,0,200,100);
    
    var xi = 10, yi = 80;
    var gwidth = 180, gheight = 180; 
    context.beginPath();
    context.lineWidth = "1";
    context.rect(xi, yi, gwidth, gheight);
    context.stroke();
    
    context.strokeStyle = "#aaaaaa";
    for (var i = 1; i < 8;i++){
        context.beginPath();
        context.moveTo(xi + i*(gwidth/8), yi)
        context.lineTo(xi + i*(gwidth/8), yi + gheight);
        context.stroke();
    
        context.beginPath();
        context.moveTo(xi, yi + i*(gheight/8));
        context.lineTo(xi + gwidth, yi + i*(gheight/8));
        context.stroke();
    }

    plotPoints(context, poly);
}



var canvasApp = function (poly) {
    console.log("Drawing");

    var theCanvas = document.getElementById("canvas");
    var context = theCanvas.getContext("2d");
    
    console.log("Drawing Canvas");

    drawScreen(context, poly); 
}

$(function(){
    var mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(41.555, -72.65957),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        maxZoom: 18,
        minZoom: 14
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    heatmap = new google.maps.visualization.HeatmapLayer();
    heatmap.setMap(map);
    heatmap.setOptions({
    	radius: 20,
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
			(function (name, poly){
				google.maps.event.addListener(poly, 'click', function(){
                                        
					console.log(name)
					$("#info-pane").css('left','')
					setTimeout(function(){
						$("#info-pane").css('left', '80%')
						$("#info-pane .name").html(name)
                        setTimeout(function(){canvasApp(poly)}, 1000);
					}, 1000);
				});
			})(response[i]['name'], p);
		}
	});
});


