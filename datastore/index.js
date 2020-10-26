const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    // if (err || !id) {
    //   id = 0;
    // }
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

// should return [{id: text}, {id: text}] ex: [{0: 'feed cat'}, {1: 'walk dog'}]

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
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
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  console.log(id);
  fs.readFile(exports.dataDir + '/' + id + '.txt', (err, text) => {
    if (err) {
      callback(err, '');
    } else {
      console.log(text.toString());
      callback(null, { id, text: text.toString() });
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////
exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
