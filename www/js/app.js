var app = angular.module('godj',['ngResource','ngRoute'])

//REST

//Song Factory ---------------------
.factory("Song", function($http) {
	return {
	get: function() {
    var songs = [];
    $http.get('/api/v1/songs').success(function(data){


      songs = data;
  });
  return songs;
},

save: function(songObject) {
        var request = $.post('/api/v1/songs',songObject, function(data) {

return data;
});
	},
	destroy: function(id) {
	return $http.delete('/api/v1/songs/' + id);
}
}

})
// Mood Factory -----------------------------------------------------
.factory("Mood", function($http) {
	return {
	get: function() {
	return $http.get('/api/v1/moods');
	},

	save: function(moodObject) {
	//return $.post('/api/v1/moods',data);
	var request = $.post('/api/v1/moods',moodObject, function(data) {

return data;
});

	},
	destroy: function(id) {
	return $http.delete('/api/v1/moods/' + id);
}
}

})
// Shoutout Factory -----------------------------------------------------
.factory("Shoutout", function($http) {
	return {
	get: function() {
	return $http.get('/api/v1/shoutouts');
	},

	save: function(shoutoutObject) {
	//return $.post('/api/v1/moods',data);
	var request = $.post('/api/v1/shoutouts',shoutoutObject, function(data) {
    console.log(data);


return data;
});

	},
	destroy: function(id) {
	return $http.delete('/api/v1/shoutouts/' + id);
}
}

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
function($scope,Mood, Song,Shoutout) {
$scope.song_requestor_name="";
$scope.song_title="";
$scope.song_artist="";
$scope.mood_requestor_name="";
$scope.mood_title="";
$scope.dj_id="";
$scope.lat=0.0;
$scope.long=0.0;
$scope.songRequests =[];
$scope.twitterUrl = 'https://twitter.com/intent/tweet?button_hashtag=NOGOLEGoDJ&text=';
$scope.moodUrl='I just sent a ' + $scope.mood_title + 'mood request to DJ' + $scope.dj_id +'http://goo.gl/V31Ewl';
$scope.songUrl='I just requested ' + $scope.song_title + ' by '+$scope.song_artist + ' to DJ' + $scope.dj_id +'http://goo.gl/V31Ewl';

$scope.url = 'ws://godj.nogole.com:8080';
$scope.addSong = function(song){
  $scope.$apply(function(){

    $scope.songRequests.push(song);
  });

};
//init function
$scope.init = function() {
if(navigator.geolocation){
navigator.geolocation.getCurrentPosition(showPosition);
}
else{
alert("Geolocation is not supported by this browser.");
}

var larapush = new Larapush($scope.url);

larapush.watch('demo').on('generic.event', function(msgEvent) {

  $scope.addSong(msgEvent.message);
  console.log($scope.songRequests);
});
};

function showPosition(pos){
$scope.lat = pos.coords.latitude;
$scope.long = pos.coords.longitude;
}

$scope.submitShoutout = function() {

  var shoutoutObject = {message:$scope.shoutout_message,dj_id:sessionStorage.dj};
  console.log(shoutoutObject);
var request = Shoutout.save(shoutoutObject);
$scope.show=true;
};

//submit mood request
$scope.submitMood = function() {
var moodObject = {requestor_name:$scope.mood_requestor_name,
title:$scope.mood_title,
dj_id:$scope.dj_id,
lat:$scope.lat,
long:$scope.long
};
sessionStorage.dj = $scope.dj_id;
var request = Mood.save(moodObject);
$scope.mood_title ="";
return request;

}
//submit song request
$scope.submitSong = function() {
//create JSON object to insert into post
var songObject = {requestor_name:$scope.song_requestor_name,
title:$scope.song_title,
artist:$scope.song_artist,
dj_id:$scope.dj_id,
lat:$scope.lat,
long:$scope.long };
sessionStorage.dj = $scope.dj_id;
var request = Song.save(songObject);
$scope.song_title ="";
$scope.song_artist ="";

return request;
}
});
