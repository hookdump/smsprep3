var importerModule = {};

var _ = require('underscore');
var jsdom = require('jsdom');
var fs = require('fs');
var jquery = fs.readFileSync(__dirname + "/../../../lib/jquery.js").toString();

importerModule.processRawData = function(raw_data, callback) {

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
        callback();

      }
    });

};

module.exports = importerModule;