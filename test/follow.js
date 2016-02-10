var async						= require('async');
var chai						= require('chai');
var should 					= chai.should;
var expect					= chai.expect;
var assert 					= chai.assert;
var superagent			= require('superagent');
var supertest				= require('supertest');

var server; 
var app;
var api;

var TEST_USER_COUNT 	= 2;
var FOLLOWING_FACTOR 	= 6;
var users = [];
var createdUsers = null;

//create an array of all new users
for (var i=0; i<TEST_USER_COUNT; i++) {
	var user = {
		email: "followtestuser" + i + "@follow.com",
		password: "followtestpwd",
		username: "FollowTestUser" + i
	}
	users.push(user);
}


before(function(done) {
		this.timeout(30000);

		server = require('../server/server.js');
		app = server.start()
		api = supertest('http://localhost:3000');

		function delay() {
			server.models.AppUser.create(users, function(err, srv_users) {
				if (err) {
					logger.error(err);
					done();
				}
				createdUsers = srv_users;
				done();
			});
		}
		setTimeout(delay, 3000);
});


describe('follow each other', function() {

 	it("should create all relationships", function(done) {
		var counter = 0;
		for (var k=0; k<(FOLLOWING_FACTOR*TEST_USER_COUNT); k++) {
			var follow_src = createdUsers[Math.floor(Math.random()*createdUsers.length)];
			var follow_dest = createdUsers[Math.floor(Math.random()*createdUsers.length)];

			//make sure following oneself is not possible :)
			while (follow_src.id == follow_dest.id) {
				follow_dest = createdUsers[Math.floor(Math.random()*createdUsers.length)];
			}

			logger.debug("ID " + follow_src.id + " follows ID " + follow_dest.id);
			api.put('/api/v1/SandboxUsers/' + follow_src.id + '/following/rel/' + follow_dest.id)
			.send()
			.end(function(err, res) {
				if (err) {
					logger.error(err);
					done(err);
				}
				counter += 1;
				logger.debug(counter);
				if (counter == (FOLLOWING_FACTOR*TEST_USER_COUNT)) {
					done();
				}
			});
			setTimeout(function() {logger.debug("waiting....")}, 2000);
		}
	});

});



