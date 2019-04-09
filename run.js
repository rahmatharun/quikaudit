const { exec } = require('child_process');
const webpack = require("webpack");
const path = require("path");
const webpackConfig = require("./webpack.dev.config.js");

var ProgressPlugin = require('webpack/lib/ProgressPlugin');

const compiler = webpack(webpackConfig);

compiler.apply(new ProgressPlugin(function(percentage, msg) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write((percentage * 100).toFixed(2) + '%');
  process.stdout.write(' '+msg);
}));

  const watching = compiler.watch({
    // Example watchOptions
    aggregateTimeout: 300,
    poll: undefined
  }, (err, stats) => {
   
    
    // ...
    if (err || stats.hasErrors()) {
      // Handle errors here
      console.log(err||stats.compilation.errors)
    }
    else{
      console.log('building cordova apps...');
      let execcordova = exec('cordova run android', {
        cwd: path.resolve(__dirname, "QuikAudit")
      });
      execcordova.stdout.on('data', function (data) {

        console.log(data.trim());
      });
    }

  });