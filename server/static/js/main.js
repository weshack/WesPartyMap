var map;
var heatmap;
var pointArray;
var polygonPtCounts = []
var samplePts = [];
/*
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
*/
var loadPoints = function(){
	$.getJSON("/checkins").done(function(response){
		ret = [];
		for (var i = 0; i < response.length; i++){
			ret.push(new google.maps.LatLng(response[i]['latitude'],response[i]['longitude']));
		}
		pointArray = response;
		console.log("We have " + pointArray.length + " points loaded.")
    	heatmap.setData(new google.maps.MVCArray(ret));
    	numNewPts();
	});
	console.log("Points loaded.")
};

var getPoints = function(poly){
    
    var xs = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110]
    var ys = [0,0,0,0,0,0,0,0,0,0,0,0]
    for (var i = 0; i < pointArray.length; i++){
        var pt = pointArray[i]
        if (poly.containsLatLng(new google.maps.LatLng(pt.latitude, pt.longitude))){
        	var now = new Date();
        	var timeZoneOffset = now.getTimezoneOffset()
            var millisBefore = now - new Date(pt.time*1000);
            var minutesBefore = millisBefore / (1000*60) + timeZoneOffset;
            if (minutesBefore <= 110 && minutesBefore > 0) { // in case of weird time zone issues
                ys[Math.floor(minutesBefore/10)] += 1;
            }
        }
    }
    return [xs,ys];
}
var drawInfo = function(ctx, pts){
    desc = ["great","slow"];
    progress = ["getting better", "dying down", "static"];
    
    messages = [["This party is awesome! Get over here while it's still happening.",
                 "There are tons of people here, and it's only getting better."],

                ["It's a little slow right now, but things are starting to pick up.", 
                 "It's still early and this party is just starting to get big"],
        
                ["Great night here, but it seems like it's starting to die down.",
                 "This party may be slowing down, but it's not to late to make your way over."],

                ["Not many people here, and it's not getting better any time soon.",
                 "It's been slow and quiet around here."],

                ["No party here tonight."]];

    
    var perc = pts[1][0]/pointArray.length;
    
    var messNum;
    if (pts[1][0] == 0){
        messNum = 4;
        console.log("Here");
    }else{
    if (pts[1][0] > pts[1][1])
        if (perc > .2)
            messNum = 0;
        else 
            messNum = 1;
    else 
        if (perc > .2)
            messNum = 2;
        else
            messNum = 3;
    }
    var variant = Math.floor(Math.random()*messages[messNum].length);


    var descNum = 1, progNum = 1;
    
    if (perc > .2)
        descNum = 0;

    if (pts[1][0] > pts[1][1])
        progNum = 0;
    if (pts[1][0] == pts[1][1])
        progNum = 2;

    $("#info-pane").removeClass('flip')
    $("#info-pane .description").html(messages[messNum][variant]
        + "  <a href='#'>See graph here</a>");
    $("#info-pane .description a").on('click', function(){
        $("#info-pane").addClass('flip');
        drawScreen(ctx,pts);
    });
}

var drawScreen = function (context, pts) {
    context.fillStyle = "#ffffff";
    context.fillRect(0,0,200,230);
    var divs = 11;
    var xi = 25, yi = 35;
    var gwidth = 165, gheight = 180; 
    
    console.log(pts[1]);
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
    context.fillText("NOW", xi + gwidth - 15, yi + gheight + 15);
    context.fillText(" 1 ", xi + .5*gwidth - 13, yi + gheight + 15);
    context.fillText(".5", xi + .75*gwidth - 9, yi + gheight + 15);
    context.fillText("1.5", xi + .25*gwidth - 18, yi + gheight + 15);
    context.fillText("Hours before now", xi + .5*gwidth - 43, yi + gheight + 30);
    


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

    var pts = getPoints(poly);
    
    console.log("Drawing Canvas");

    drawInfo(context, pts); 
}

var loadComments = function () {
    $.getJSON("/comment").done(function(response){
        $("#commentbox").html('')
        //console.log("response" + response)
        if (response){
            for (var i = 8; i >= 0; i--) {
                $('#commentbox').append($('<li>').attr('id',"list-item-" + i).html(response[i]))
                // $('#commentbox').scrollTop(10000);
        }
        };
        // $("#list-item-0").css('opacity','1');
        setTimeout(refreshComments, 1000);
    });
}

var refreshComments = function () {
    $.getJSON("/comment").done(function(response){
        //console.log(response[0] + '  '+ $("#list-item-0").html())
        if (response[0] != $("#list-item-0").html()){
            for (var i = response.length - 1; i >= 0; i--) {
                $("#list-item-" + i).html(response[i]);
                if (i === 0){
                    $("#list-item-0").addClass('new-item');
                    // $('#commentbox').scrollTop($('#commentbox').scrollHeight);
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

var numNewPts = function(){
	$("#recent").html(pointArray.filter(function(el){
		var now = new Date();
        var timeZoneOffset = now.getTimezoneOffset()
        var millisBefore = now - new Date(el.time*1000);
        var minutesBefore = millisBefore / (1000*60) + timeZoneOffset;
		return minutesBefore < 30;
	}).length)
	setTimeout(numNewPts, 1000*60*5);
}

var bestPlace = function(){
	var max = 0;
	var best = null;
	for (var i = 0; i < polygonPtCounts.length; i++){
		if (polygonPtCounts[i].number > max){
			max = polygonPtCounts[i].number
			best = polygonPtCounts[i].name
		}
	}
	if (max > 0) {
		$("#best-place").html("The best party tonight is over at " + best + ".");
	} else {
		$("#best-place").html("There are no parties!");
	}
	setTimeout(bestPlace, 1000*60*5);
}

var loadPolygons = function(response){
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
		var heights = getPoints(p)[1]
		var num = heights[0] + heights[1] + heights[2];
		polygonPtCounts.push({
			name: response[i]['name'],
			number: num
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
}

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
    $(document).one('ajaxStop',function(){$.getJSON("/static/json/polygons.json").done(loadPolygons)});
    $(document).one('ajaxStop',bestPlace);
    loadComments()
    $('#submitComment').click(function() {
        var formdata = $('#new-comment-box').val();
        console.log(formdata);
        $.post('/comment', { 'message': formdata });
        $('#new-comment-box').val('');

        return false;
    });
    $("#info-pane .return").on('click',function(){
        $("#info-pane").removeClass('flip');
    });

    $("#info-pane .exit").on('click',function(){
        $("#info-pane").css('left', '110%')
    });

    $("#more-btn").click(function(){
        $("#more").toggleClass('active');
    });
});
