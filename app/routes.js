var path = require('path');

module.exports = function(app, passport) {


// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	
	app.get('/uploadtweet', isLoggedIn, function(req, res) { 
        res.sendfile(path.resolve('views/twitter2.html'), {
            user : req.user    
		});
	});
	

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('login.ejs', { message: req.flash('loginMessage') });
		});

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('signup.ejs', { message: req.flash('loginMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));
	

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				successRedirect : '/uploadtweet',
				failureRedirect : '/'
			}));


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}



var data;
app.post('/upload', function (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('index.ejs', {
        message: req.flash(err)
      });
    } else {
      if(req.file == undefined){
        res.render('index.ejs', {
          message: req.flash('Error: No File Selected!')
        });
      } else {
      	data = require('fs').readFileSync(req.file.path);


      	client.post('media/upload', {media: data}, function(error, media, response) {

  if (!error) {

    // If successful, a media object will be returned.
    console.log(media);

    // Lets tweet it
    var status = {
      status: 'I am a tweet',
      media_ids: media.media_id_string // Pass the media id string
    }

    client.post('statuses/update', status, function(error, tweet, response) {
      if (!error) {
        console.log(tweet);
      }
    });

  }
});
        res.render('index', {
          msg: 'File Uploaded!',
          file: `uploads/${req.file.filename}`
        });
        
      }
    }
  });
});


