var loadPoints = function(){
	$.getJSON("/checkins", function(response){
		ret = [];
		for (var i = 0; i < response.length; i++){
			ret.push({new google.maps.LatLng(response[i]['latitude'],response[i]['longitude'])});
		}
		return ret;
	});
};