var importerModule = {};

var _ = require('underscore');
var jsdom = require('jsdom');
var fs = require('fs');
var jquery = fs.readFileSync(__dirname + "/../../../lib/jquery.js").toString();
var Step = require('step');

importerModule.processRawData = function(raw_data, lib, reporter, callback) {

  reporter(5, 'Preparing importer module...', null);  // Progress report * * * *

	jsdom.env({
      html: raw_data
      , src: [jquery]
      , done: function (err, window) {

        Step(
          function getStarted() {
            log.info('getting started...');
            var $ = window.jQuery;
            var mapping = {};

            reporter(10, 'Initializing parser...', null);  // Progress report * * * *
            
            // Load the table
            var table = $('body').find("table");

            // Remove artifacts
            $(table).find(".rShim").remove();
            $(table).find(".hd").remove();
            $(table).find("tr").first().remove();

            // Load rows
            var rows = $(table).find("tr");
            var rows_total = rows.length;
            var control_code = '';
            var options_count = 0;
            var progress_step = Math.round(rows_total/4);
            var progress_counter = 0;
            var qObj = {};
            
            log.notice("loaded " + rows.length + " rows! processing...");
            reporter(15, 'Mapping columns...', null);  // Progress report * * * *

            log.info('processing everything...');
            var group = this.group();

            $(rows).each(function(tr_id, tr_el) {

              var cur_row =[];
              $(tr_el).find("td").each(function(td_id, td_el) {
                cur_row.push( $(td_el).text() );
              });

              if (tr_id === 0) {
              
                // Column mapping
                log.notice("mapping columns...");
                _.each( cur_row , function(el, id) {

                  if (id === 0) {
                    // Control row, control code:
                    control_code = el;
                    options_count = +control_code.substring(10);
                  }

                  mapping[ el ] = id;
                });

                log.success("mapping done! =>");
                log.success( mapping );

                log.success("control code: " + control_code);
                log.success("questions have up to " + options_count + " options");

                reporter(20, 'Processing questions...', null);  // Progress report * * * *
              
              } else {

                // Build question object:
                var univ_id = cur_row[0];
                var newQuestion = {
                  universal_id: univ_id
                  , text: cur_row[ mapping['QTEXT'] ]
                  , qoptions: []
                  , feedback: {
                    'correct': cur_row[ mapping['FEEDBACK_CORRECT'] ]
                    , 'incorrect': cur_row[ mapping['FEEDBACK_INCORRECT'] ]
                  }
                };

                // Build question options:
                var first_cell      = +mapping['ANS_A'];
                var last_cell       = first_cell + options_count;
                var correct_letter  = cur_row[ mapping['ANS_CORRECT'] ];
                var correct_code    = correct_letter.toLowerCase().charCodeAt(0) - 97;
                var correct_cell    = correct_code + first_cell;
                
                for (var i=first_cell; i < last_cell; i++) {
                  var qopt = {
                    text: cur_row[i]
                    , correct: (i === correct_cell)
                  };
                  newQuestion.qoptions.push(qopt);
                }

                // Store question!
                lib.Content.Question.upsertQuestion(univ_id, newQuestion, group());
                
                var q_text = cur_row[ mapping['QTEXT'] ];
                var q_status = "OK";
                qObj[univ_id] = {t: q_text, s: q_status};

                progress_counter++;
                if (progress_counter > progress_step) {
                  progress_counter = 0;
                  reporter( 20 + Math.round(80*tr_id/rows_total) , '%', qObj );  // Progress report * * * *
                  qObj = {};
                  log.info()
                  log.success(newQuestion);
                }
                

              }

            });

            this(null);

          },
          function finish(err) {
            if (err) {
              log.error('error!');
              log.error( err );
            }
            log.info('finishing importing...');
            reporter( 100, '%' );  // Progress report * * * *
            // console.log( rows[0] );
            
            // console.log("Now got " + $(rows).length + " rows");
            // console.log( $(r).html() ); // outputs Hello World
            callback();
          }
        );
        


      }
    });

};

module.exports = importerModule;