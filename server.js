  //Install express server
  const express = require('express');
  const path = require('path');
  
  const app = express();
  const port = process.env.PORT || 4444;
  
  
  // Serve only the static files form the dist directory
  app.use(express.static(__dirname + '/dist'));
  
//   app.get("/ngsw-worker.js", (req, res) => {
//     res.sendFile(path.resolve(__dirname + '/dist/product-ui/assets/ngsw-worker.js'));
//   });
  
  app.get('/*', function (req, res) {
      res.sendFile(path.join(__dirname + '/dist/index.html'));
  });
  
  // Start the app by listening on the default Heroku port
  app.listen(port, function () {
      console.log("Server started on port " + port);
  });