const express = require('express');
const path = require('path');
const app = express();
const cfenv = require('cfenv').getAppEnv();

app.use(express.static(__dirname + '/dist/'));

app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
});

app.listen(cfenv.port, error => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎  Listening on port ${cfenv.port}. Url: ${cfenv.url} `);
  }
});
