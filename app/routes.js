
var path = require('path');

module.exports = function(app, passport) {

// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	
	app.get('/index2', isLoggedIn, function(req, res) { 
        res.sendfile(path.resolve('views/patient.html'), {
            user : req.user,        
		});
	});



	/*app.get('/researcher', isLoggedIn, function(req, res) { 
        res.sendfile(path.resolve('views/researcher.html'), {
            user : req.user       
		});
	});

	app.get('/doctor', isLoggedIn, function(req, res) { 
        res.sendfile(path.resolve('views/doctor.html'), {
            user : req.user        
		});
	});*/


	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				successRedirect : '/pages/index2',
				failureRedirect : '/'
			}));

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
