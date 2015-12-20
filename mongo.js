var mongoose = require('mongoose');
var localMongoLab = 'mongodb://localhost:27017/';
var dbname = 'ask';

var url = process.env.MONGOLAB_URI || localMongoLab + dbname;
var db = null;
var User = null;
var Result = null;

var UserSchema = new mongoose.Schema({
  userid: { type: String, index: { unique: true } },
  name: { type: String },
  type: { type: String },
  competency: { type: String },
  cookie: { type: String },
  corrects: { type: Number, default: 0, index: true },
  points: { type: Number, default: 0.0, index: true }
});
var ResultSchema = new mongoose.Schema({
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  period: { type: Number, index: true },
  question: { type: Number, index: true },
  answer: { type: String },
  time: { type: Number, default: 0.0 }
});

mongoose.model('User', UserSchema);
mongoose.model('Result', ResultSchema);
mongoose.connect(url);

db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {
  console.log('Connected to ' + dbname);
  User = mongoose.model('User');
  Result = mongoose.model('Result');

  if(process.env.NODE_ENV != 'production') {
    populateDB();
  }
});

exports.findUser = function(req, res) {
  User.findOne({ userid: req.params.userid }, function(err, result) {
    if(err) res.send({ 'error': 'An error has occurred while finding user' });
    else {
      res.json(result);
    }
  });
}

exports.registerUser = function(req, res) {
  req.session.userid = req.params.userid;

  User.where({ userid: req.params.userid }).update({ cookie: req.sessionID }, function(err, result) {
    if(err) res.send({ 'error': 'failed to save cookie' });
    else res.redirect('/answer/' + req.params.userid);
  });
}

exports.getAns = function(req, res) {
  User.findOne({ userid: req.params.userid }, function(err, result) {
    Result.findOne({ question: parseInt(req.params.question) }, function(e, r) {
      r._user = result;
      console.log(r);
      res.json(r);
    });
  });
}

exports.submitAns = function(req, res) {
  User.findOne({ userid: req.body.userid }, function(err, result) {
    if(err) {  }
    else {
      Result.create({
        _user: result._id,
        period: parseInt(req.body.period),
        question: parseInt(req.body.question),
        answer: req.body.answer,
        time: parseFloat(req.body.time)
      });
    }
  });
}

exports.updateStat = function(req, res) {
  User.where({ userid: req.body.userid })
  .update({ $inc: { corrects: 1, points: parseFloat(req.body.time) } }, function(err, result) {
    if(err) console.log(err);
    else console.log(result);
  });
}

exports.getDist = function(req, res) {
  Result.aggregate([
    { $match: { question: parseInt(req.params.question) } },
    { $group: { _id: '$answer', y: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ], function(err, result) {
    if(err) console.log(err);
    else {
      res.json(result);
    }
  });
}

exports.getRank = function(req, res) {
  Result.find({ question: req.params.question, answer: req.params.answer }, {},
    { sort: { time: 1 }, limit: 10 }).populate('_user').exec(function(err, result) {
    if(err) console.log(err);
    else {
      res.json(result);
    }
  });
}

exports.getOverall = function(req, res) {
  User.find({ corrects: { $ne: 0 } }, {},
    { sort: { corrects: -1, points: 1 } }, function(err, result) {
    if(err) console.log(err);
    else res.json(result);
  });
}

exports.resetDB = function(req, res) {
  User.update({}, { $set: { corrects: 0, points: 0, cookie: '' } }, function(err, result) {
    res.json();
  });
  Result.remove({}, function(err, result) {
    res.json();
  });
}

function populateDB() {
  //User.remove({}, function() {});
  User.update({}, { $set: { corrects: 0, points: 0, cookie: '' } }, function() {});
  Result.remove({}, function() {});

  /*
  User.find(function(err, result) {
    for(var r=0; r<result.length - 265; ++r) {
      for(var i=1; i<=20; ++i) {
        Result.create({
          _user: result[r]._id,
          period: 1,
          question: i,
          answer: (i == 7 || i == 54 || i == 17 || i == 25 || i == 34 || i == 40 || i == 47) ? '4213' : '' + Math.floor((Math.random() * 4) + 1),
          time: Math.floor((Math.random() * 10) + 1)
        });
      }
    }
  });
  */
}