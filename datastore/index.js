const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

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
  fs.readdir( exports.dataDir, (err, files) => {
    if (err) {
      throw new Error('Cannot readfile');
    }

    let promises = files.map( (file) => {
      return new Promise( (resolve, reject) => {
        let id = file.slice(0, 5);
        fs.readFile(exports.dataDir + '/' + id + '.txt', (err, text) => {
          if (err) {
            reject(err);
          } else {
            text = text.toString();
            let todo = { id: id, text: text };
            resolve(todo);
          }
        });
      });
    });
    Promise.all(promises).then( (values) => {
      callback(null, values);
    });
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
