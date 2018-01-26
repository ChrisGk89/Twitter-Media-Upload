var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
const multer = require('multer');
const path = require('path');


//Twitter credentials
var client = new Twitter({
  consumer_key: 'LLPwgnBjYUvpGusXyyQb5QMAh',
  consumer_secret: 'oCg6nwCy2HN3k1RgbP71xxLa8UQOEclKCFCrdnSbXLhO7KrnwG',
  access_token_key: '162027406-utH1pSRECdzsFzFaaPI1ekeHmwKPGEvbcw3Tqqo6',
  access_token_secret: 'IfDKKJyziu87ZhQWFoBW9l3ttoqWvDIT9t75Sn4qvmrOq'
});

var params = {screen_name: 'nodejs'};




// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
  res.render('index');
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    //req.flash('error_msg','You are not logged in');
    res.redirect('/views/index');
  }
}




// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|mp4/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images and Videos Only!');
  }
}


// Public Folder
router.use(express.static('./public'));

router.get('/', (req, res) => res.render('index'));
var data;
router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('index', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'Error: No File Selected!'
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

module.exports = router;