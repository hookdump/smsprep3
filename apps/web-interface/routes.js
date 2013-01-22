var fs = require('fs');
var jsdom = require('jsdom');
var jquery = fs.readFileSync(__dirname + "/../../lib/jquery.js").toString();

var _ = require('underscore');

var upload_dir = __dirname + "/public/upload/";

exports.init = function(app, config, lib, passport) {

  app.get('/', function(req, res) {

    if (req.user) {
      res.redirect('/dashboard');

    } else {
      res.render('index', { title: config.title, cur_section: "index" });

    }

  });

  app.get('/login', function(req, res) {
    res.render('login', { title: config.title });
  });

  app.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true } )
  );

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.get('/join', function(req, res) {
    res.render('join', { title: config.title });
  });

  app.post('/join', function(req, res) {
    lib.User.createUser( req.body.username, req.body.password, function(err, u, msg) {
      if (err || !u) {
        req.flash('error', msg.error);
        res.redirect('/?err=1');
      } else {
        req.flash('success', msg.success);
        res.redirect('/');
      }
    });
  });

  app.get('/dashboard', function(req, res) {
    var info = {};
    res.render('dashboard', { title: config.title, cur_section: "dashboard", info: info });  
  });

  app.get('/students', function(req, res) {
    var info = {};
    res.render('students', { title: config.title, cur_section: "students", info: info });  
  });

  app.get('/content', function(req, res) {
    // Load lessons:
    var lessons = [
      {
        test_code: "SAT"
        , lesson_code: "FRACTIONS"
        , questions: []
      },
      {
        test_code: "SAT"
        , lesson_code: "EXPONENTIALS"
        , questions: []
      }
    ];

    // List CSV files:
    fs.readdir(upload_dir, function(err, files) {
      console.log( "Listing files..." );

      res.render('content', { title: config.title, cur_section: "content", lessons: lessons, files: files });  
    });
    
  });

  app.get('/content/import/:filename', function(req, res) {
    var file = upload_dir + req.params.filename;
    var raw_data = fs.readFileSync(file).toString();
    console.log("Importing " + file);

    jsdom.env({
      html: raw_data
      , src: [jquery]
      , done: function (err, window) {
        var $ = window.jQuery;
        var mapping = {};
        
        // Load the table
        var table = $('body').find("table");

        // Remove artifacts
        $(table).find(".rShim").remove();
        $(table).find(".hd").remove();
        $(table).find("tr").first().remove();

        // Load rows
        var rows = $(table).find("tr");
        console.log("Loaded " + rows.length + " rows. Processing...");

        $(rows).each(function(tr_id, tr_el) {

          var cur_row =[];
          $(tr_el).find("td").each(function(td_id, td_el) {
            cur_row.push( $(td_el).text() );
          });

          if (tr_id === 0) {
          
            // Column mapping
            console.log("Mapping columns...");
            _.each( cur_row , function(el, id) {
              mapping[ el ] = id;
            });

            console.log("Mapping done! =>");
            console.log( mapping );
          
          } else {
            
            // Data processing
            console.log("Processing row " + tr_id + "...");

          }

        });
        
        console.log("DONE!");
        // console.log( rows[0] );
        
        // console.log("Now got " + $(rows).length + " rows");
        // console.log( $(r).html() ); // outputs Hello World
      }
    });

    res.json({success: true});
    
  });


  app.get('/content/:code', function(req, res) {
    var full_code = req.params.code;
    var codes = full_code.split("_");
    var code_data = {
      full_code: full_code
      , test_code: codes[0]
      , lesson_code: codes[1]
    };

    var questions = [
      {
        text: "What is 2+2?"
        , id: "1"
        , options: [
          {text: "5", correct: false}
          , {text: "7", correct: false}
          , {text: "4", correct: true}
        ]
        , feedback: {
          "correct": "Yeah! That was easy, wasn't it?"
          , "incorrect": "Nooo! 2+2 equals 4 because blah blah blah"
        }
      },
      {
        text: "What is 10+5?"
        , id: "2"
        , options: [
          {text: "15", correct: true}
          , {text: "17", correct: false}
          , {text: "5", correct: false}
        ]
        , feedback: {
          "correct": "Yeah! That was easy, wasn't it?"
          , "incorrect": "Nooo! 10 + 5 equals 15 because blah blah blah"
        }
      }
    ];

    res.render('content_detail', { title: config.title, cur_section: "content_detail", codes: code_data, questions: questions });  
  });

}
