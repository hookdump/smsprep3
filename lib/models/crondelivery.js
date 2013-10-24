var mongoose    = require('mongoose')
  , Schema      = mongoose.Schema
  , db          = require('./db')
  , supergoose  = require('supergoose')
  , _           = require('underscore');

// ------------------------------------------------------------------------
// Message Model

var CronDeliverySchema = new Schema({
  timezone:   { type: String }
  , schedule:   { type: String }
  , count:      { type: Number }

  , created:    { type: Date,     default: null, index: true }
  , delivered:  { type: Date,     default: null }
  , lastError:  { type: String,   default: null }
  , test:       { type: Boolean,  default: false }
});
CronDeliverySchema.virtual('id')
.get(function () {
  return this._id;
});

CronDeliverySchema.statics.validateData = require('./validations/cron_validation.js');


CronDeliverySchema.statics.create = function(data, cb) {
  var self = this;
  var creating = new this();

  // initialize new message
  var now = new Date();
  creating.created = now;

  // Validate data:
  self.validateData(data, 'create', function(err, data, result) {

    if (result.success) {

      creating.timezone   = data.timezone;
      creating.schedule   = data.schedule;
      creating.count      = data.count;

      creating.save( function(err, created) {
        if (err) {
          cb(err, null);
        } else {
          cb(null, created);
        }
      });

    } else {

      return cb({errors: result.error_messages});

    }

  });

}

CronDeliverySchema.statics.loadUpcoming = function(cb) {
  // Calc next crons...
  return cb(null, {foo: 'bar'});
};

CronDeliverySchema.statics.loadRecent = function(cb) {
  var self = this;
  self.find({}).sort({created: 1}).limit(10).exec(function(err, data) {
    log.debug('loading ' + data.length + ' crons...');
    return cb(err, data);
  });
}

module.exports = db.model('CronDelivery', CronDeliverySchema);