var app = angular.module('godj',['ngResource','ngRoute']);

//REST
app.factory("Song", function($resource) {
	return $resource('http://www.godj.nogole.com/api/v1/songs/:id');
});
app.factory("Mood", function($resource) {
	return $resource('http://www.godj.nogole.com/api/v1/moods/:id');
});

//
app.config([
    "$routeProvider",
    "$httpProvider",
    function($routeProvider, $httpProvider){
			// We need to setup some parameters for http requests
    // These three lines are all you need for CORS support
    $httpProvider.defaults.useXDomain = true;
    //Request header field Content-Type is not allowed by Access-Control-Allow-Headers.$httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

app.controller(
"requestController",
function($scope,Mood, Song) {
$scope.song_requestor_name="";
$scope.song_title="";
$scope.song_artist="";
$scope.song_dj_id="";
$scope.mood_requestor_name="";
$scope.mood_title="";
$scope.mood_dj_id="";
$scope.lat=0.0;
$scope.long=0.0;



//submit mood request
$scope.submitMood = function() {

var moodObject = {requestor_name:$scope.mood_requestor_name,
title:$scope.mood_title,
dj_id:$scope.mood_dj_id,
lat:$scope.lat,
long:$scope.long
};

var request = Mood.save(moodObject, function() {
	alert("Request Sent!");
});
$scope.mood_title ="";
return request;

};

$scope.getGeo = function()
{
	if(navigator.geolocation){
navigator.geolocation.getCurrentPosition(function(pos) {
	$scope.lat = pos.coords.latitude;
	$scope.long = pos.coords.longitude;
});
}
else{
alert("Geolocation is not supported by this browser.");
}
};




//submit song request
$scope.submitSong = function() {


//create JSON object to insert into post
var songObject = {requestor_name:$scope.song_requestor_name,
title:$scope.song_title,
artist:$scope.song_artist,
dj_id:$scope.song_dj_id,
lat:$scope.lat,
long:$scope.long };

var request = Song.save(songObject, function() {
	alert("Request Sent!");
});
$scope.song_title ="";
$scope.song_artist ="";

return request;
}
$scope.getGeo();
});
