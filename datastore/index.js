const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    let path = exports.dataDir + '/' + id + '.txt';
    fs.writeFile(path, text, (err) => {
      if (err) {
        throw ('create todo error');
      } else {
        callback(null, {id, text});
      }
    });
  });
};

exports.readAll = (callback) => {
  var data = [];
  fs.readdir( exports.dataDir, (err, files) => {
    if (err) {
      callback(null, data);
    }
    files.forEach( (file) => {
      let id = file.slice(0, 5);
      let todo = {id: id, text: id};
      data.push(todo);
    });
    callback(null, data);
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', (err, text) => {
    if (err) {
      callback(err, '');
    } else {
      callback(null, { id, text: text.toString() });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.access(exports.dataDir + '/' + id + '.txt', (err) => {
    if (err) {
      callback(err, '');
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
        if (err) {
          throw ('Cannot write to file');
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(exports.dataDir + '/' + id + '.txt', (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////
exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
