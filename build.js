const { exec } = require('child_process');
const webpack = require("webpack");
const path = require("path");
const webpackConfig = require("./webpack.prod.config.js");

const compiler = webpack(webpackConfig);
  
  compiler.run((err, stats) => {
    // ...
    if (err || stats.hasErrors()) {
        // Handle errors here
        console.log(err||stats.compilation.errors)
      }
      else{
          console.log(path.resolve(__dirname, "QuikAudit/www/js"))
        console.log('building cordova apps...');
        let execcordova = exec('cordova run android', {
          cwd: path.resolve(__dirname, "QuikAudit/")
        });
        execcordova.stdout.on('data', function (data) {
  
          console.log(data.trim());
        });
      }

  });
