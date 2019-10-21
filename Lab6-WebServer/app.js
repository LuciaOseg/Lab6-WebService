const path = require('path')
const express = require('express')
const weather = require('./weather.js')

const app = express()

const port = process.env.PORT || 3000;

app.get('/', function(req, res) {
   res.send('<h1>Holaa</h1>')
});

app.get('/weather', function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if( !req.query.search ) {
    return res.send({
      error: 'Tienes que dar una ciudad a buscar'
    })
  }
  weather.weather(req.query.search, function(error, response) {
    if(error) {
      return res.send({
        error: error
      })
    }
      res.send({
        location: req.query.search,
        weather: response
      })
    }
  )
})

app.get('*', function(req, res) {
  res.send({
    error: 'Esta ruta no existe'
  })
})

app.listen(port, function() {
  console.log('Up and Running!')
})
