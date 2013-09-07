var map;
var heatmap;
var pointArray;

var samplePts = [];
for (var i = 0; i < 300; i++){
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
    samplePts.push({latitude:41.5558487388, longitude:-72.6585519627, time:new Date().getTime() - 52*60000});
}


for (var i = 0; i < 2; i++){
    samplePts.push({latitude:41.5558487388, longitude:-72.6585519627, time:new Date().getTime() - 62*60000});
}


for (var i = 0; i < 4; i++){
    samplePts.push({latitude:41.5558487388, longitude:-72.6585519627, time:new Date().getTime() - 112*60000});
}


for (var i = 0; i < 4; i++){
    samplePts.push({latitude:41.5558487388, longitude:-72.6585519627, time:new Date().getTime() - 82*60000});
}


for (var i = 0; i < 7; i++){
    samplePts.push({latitude:41.5558487388, longitude:-72.6585519627, time:new Date().getTime() - 12*60000});
}

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

var getPoints = function(context, poly){
    
    xs = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110]
    ys = [0,0,0,0,0,0,0,0,0,0,0,0]

    for (var i = 0; i < samplePts.length; i++){
        pt = samplePts[i]
        if (poly.containsLatLng(new google.maps.LatLng(pt.latitude, pt.longitude))){
            minBefore = Math.floor((new Date().getTime() - pt.time)/60000/10)*10
            ys[minBefore/10] += 1; 
        }
    }
    return [xs,ys];
}
var drawInfo = function(ctx, pts){
    desc = ["great","slow"];
    progress = ["getting better", "dying down"];
    var perc = pts[1][0]/pointArray.length;
     
    var descNum = 1, progNum = 1;
    
    if (perc > .2)
        descNum = 0;

    if (pts[1][0] > pts[1][1])
        progNum = 0;
    $("#info-pane").removeClass('flip')
    $("#info-pane .description").html("This party is " + desc[descNum] + ", and it's " + progress[progNum] + "."
        + "  <a href='#'>See graph here</a>");
    $("#info-pane .description a").on('click', function(){
        $("#info-pane").addClass('flip');
        drawScreen(ctx,pts);
    });
}

var drawScreen = function (context, pts) {
    context.fillStyle = "#ffffff";
    context.fillRect(0,0,200,300);
    var divs = 11;
    var xi = 25, yi = 50;
    var gwidth = 165, gheight = 180; 
    
    console.log(pts);
    var ymax = Math.ceil(Math.max.apply(null, pts[1])/12)*12;
    if (ymax == 0)
        ymax = 12;

    context.strokeStyle = "#000000";
    context.beginPath();
    context.lineWidth = "1";
    context.rect(xi, yi, gwidth, gheight);
    context.stroke();
    
    context.fillStyle = "black";
    context.font = "10px Arial";
    
    xlabs = ["-2hr", "-1.5hr", "-1hr", "-.5r", "now"];


    context.strokeStyle = "#aaaaaa";
    for (var i = 0; i < divs;i++){
        context.beginPath();
        context.moveTo(xi + i*(gwidth/divs), yi)
        context.lineTo(xi + i*(gwidth/divs), yi + gheight);
        context.stroke();
        
        context.fillText("" + ymax*(12 - i)/(divs+1), 5, yi + i*(gheight/divs) + 5);     

        context.beginPath();
        context.moveTo(xi, yi + i*(gheight/divs));
        context.lineTo(xi + gwidth, yi + i*(gheight/divs));
        context.stroke();
    }


    context.strokeStyle = "#0000ff";
    
    for (var i = 0; i < pts[0].length - 1; i++){
        context.beginPath();
        context.moveTo(xi + gwidth*(1- i/divs), yi + gheight * (1-pts[1][i]/ymax));
        context.lineTo(xi + gwidth*(1-(i+1)/divs), yi + gheight * (1-pts[1][i+1]/ymax));
        context.stroke();
    }


}



var canvasApp = function (poly) {
    console.log("Drawing");

    var theCanvas = document.getElementById("canvas");
    var context = theCanvas.getContext("2d");

    var pts = getPoints(context, poly);
    
    console.log("Drawing Canvas");

    drawInfo(context, pts); 
}

var loadComments = function () {
    $.getJSON("/comment").done(function(response){
        $("#commentbox").html('')
        for (var i = response.length - 2; i >= 0; i--) {
            $('#commentbox').append($('<li>').attr('id',"list-item-" + i).html(response[i]))
            $('#commentbox').scrollTop(10000);
        };
        // $("#list-item-0").css('opacity','1');
        setTimeout(refreshComments, 1000);
    });
}

var refreshComments = function () {
    $.getJSON("/comment").done(function(response){
        if (response[0] != $("#list-item-0").html()){
            for (var i = response.length - 1; i >= 0; i--) {
                $("#list-item-" + i).html(response[i]);
                if (i === 0){
                    $("#list-item-0").addClass('new-item');
                    $('#commentbox').scrollTop($('#commentbox').scrollHeight);
                    // $("#list-item-0").bind("webkitTransitionEnd mozTransitionEnd oTransitionEnd msTransitionEnd transitionend", function(){
                    setTimeout(function(){
                        $("#list-item-0").removeClass("new-item");
                        $("#list-item-1").removeClass("old-item");
                        $("#list-item-2").removeClass("old-item");
                        $("#list-item-3").removeClass("old-item");
                        $("#list-item-4").removeClass("old-item");
                        $("#list-item-5").removeClass("old-item");
                        $("#list-item-6").removeClass("old-item");
                        $("#list-item-7").removeClass("old-item");
                        $("#list-item-8").removeClass("old-item");
                    }, 1000);
                    // $("#list-item-0").removeClass("new-item");
                    // });
                }
                else {
                    $("#list-item-"+i).addClass('old-item');
                    
                }
            };
        }
        setTimeout(refreshComments, 1000);

    })
}

var checkPos = function(){
	var center = map.getCenter();
	var newLat = center.ob;
	var newLong = center.pb;
	var changed = false;
	if (center.ob < 41.54356550447476) {
		newLat = 41.54356550447476;
		changed = true;
	} else if (center.ob > 41.5614860146243) {
		newLat = 41.5614860146243;
		changed = true;
	}
	if (center.pb < -72.6740026473999) {
		newLong = -72.6740026473999;
		changed = true
	} else if (center.pb > -72.6467514038086) {
		newLong = -72.6467514038086;
		changed = true;
	}
	if (changed){		
		map.panTo(new google.maps.LatLng(newLat, newLong));
	}
	setTimeout(checkPos, 500);
}

// var addNewComment = function () {
//     var x=document.forms["newComment"]["newcomment"].value;
//     console.log(x)
//     return false
// }
$(function(){
    var mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(41.555, -72.65957),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        maxZoom: 18,
        minZoom: 14,
        streetViewControl: false,
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    checkPos();
    heatmap = new google.maps.visualization.HeatmapLayer();
    heatmap.setMap(map);
    heatmap.setOptions({
    	radius: 20,
    	maxIntensity: 20
    });
    google.maps.event.addListener(map, 'click', function(e){
    	console.log(e.latLng)
    })
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
                        canvasApp(poly);
                        setTimeout(function(){canvasApp(poly)}, 1000);
					}, 1000);
				});
				google.maps.event.addListener(poly, 'mouseover', function(){
					poly.setOptions({ fillColor: 'rgba(255,0,0,.5)'});
				});
				google.maps.event.addListener(poly, 'mouseout', function(){
					poly.setOptions({ fillColor: 'rgba(255,0,0,0)'});
				});
			})(response[i]['name'], p);
		}
	});
    loadComments()
});
$(function() {
    $('#submitComment').click(function() {
        var formdata = $('#new-comment-box').val();
        console.log(formdata);
        $.post('/comment', { 'message': formdata });
        $('#new-comment-box').val('');

        return false;
    });
});


