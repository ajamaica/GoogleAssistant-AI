'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').ApiAiApp;
const igdb = require('igdb-api-node');
const moment = require('moment');


global.mashapeKey = '';
const GAME_PARAMETER = 'Game';

// [START YourAction]
exports.hook = (request, response) => {
  const app = new App({request, response});
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

  // Fulfill action business logic
  function findInfoHandler (app) {
	const query = app.getArgument(GAME_PARAMETER)
    // Complete your fulfillment logic and send a response
	igdb.games({
	  search: query,
	  limit: 3,
	  fields: "*"
	}).then(function(output){

		var spech =  output.body[0].name + " : " + output.body[0].summary;
		app.ask( spech);
		
	});
  }

  function timereleaseHandler (app) {
	const query = app.getArgument(GAME_PARAMETER)
	
    igdb.games({
	  search: query,
	  limit: 3,
	  fields: "*"
	}).then(function(output){
		var day = moment(output.body[0].first_release_date * 1000);
		
		var spech = "The game " + output.body[0].name + " was released in " + day.format("dddd, MMMM Do YYYY"); 
		app.ask( spech);
		
	});
  }

  function ratingHandler (app) {
	const query = app.getArgument(GAME_PARAMETER)
	
    igdb.games({
	  search: query,
	  limit: 3,
	  fields: "*"
	}).then(function(output){

		var spech = "The overall rating of " + output.body[0].name + " is " + output.body[0].rating.toFixed(2); 
		app.ask( spech);
		
	});


  }

  function timetobeatHandler (app) {
	const query = app.getArgument(GAME_PARAMETER)
	
	igdb.games({
	  search: query,
	  limit: 3,
	  fields: "*"
	}).then(function(output){

		var time_to_beat = output.body[0].time_to_beat.normally / 60 / 60  ;
		var spech = "The average time to beat of " + output.body[0].name + " is " + time_to_beat.toFixed(2) +" hours."; 
		app.ask( spech);

	});
  }


  const actionMap = new Map();
  actionMap.set('Find_Information', findInfoHandler);
  actionMap.set('Rating', ratingHandler);
  actionMap.set('Time_release', timereleaseHandler);
  actionMap.set('Time_to_Beat', timetobeatHandler);


  app.handleRequest(actionMap);
};
// [END YourAction]
