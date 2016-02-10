var path = require('path');
var app = require(path.resolve(__dirname, '../server/server'));

require('events').EventEmitter.prototype._maxListeners = 40;

var dataSource = app.dataSources.db;

console.log('dataSource', dataSource.settings);


// Update all models
dataSource.autoupdate(function(err) {
  if (err)
    console.log(err);
  else {
    console.log("Successfully updated");
  }
  process.exit();
});

