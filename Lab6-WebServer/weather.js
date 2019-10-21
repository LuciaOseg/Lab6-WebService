
const request = require('request');

let city = "Monterrey";

//Obtiene los datos del clima Daily
function getWeather(lat,long, callback) {
  request.get(`https://api.darksky.net/forecast/${DARK_SKY_SECRET_KEY}/${lat},${long}?lang=es&units=si`,
    function (error, response, body){
      //Errores
      if(error){
        callback("Servicio no disponible", undefined)
      } else
      if(response.body == 'Forbidden\n'){
        callback('Las credenciales son incorrectas',undefined)
      } else
      if(response.body.code == 400){
          callback(response.body.error, undefined);
      } else
      if(response.body == 'Not Found\n'){
        callback('Lo sentimos el lugar no fue encontrado',undefined)
      }
      //Sin error
      else {
        let jsonRequest = JSON.parse(body);
        let weatherData = {
          summary: jsonRequest.daily.data[0].summary,
          temperature: jsonRequest.currently.temperature,
          precipProbability : jsonRequest.daily.data[0].precipProbability
        }
        callback(undefined,weatherData);
      }
    }
  );
}

//Obtiene las coordenadas geograficas de la ciudad
function getGeo(city_name, callback) {
  request.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${city_name}.json?access_token=${MAPBOX_TOKEN}`,
    function (error, response, body){
      let jsonBody = JSON.parse(body);
      //Errores
      if (error){
        callback("Servicio no disponible",undefined)
      } else
      if(jsonBody.message == "Not Found"){
        callback("No encontrado", undefined);
      } else
      if(jsonBody.message == 'Not Authorized - Invalid Token'){
        callback("El token es invalido", undefined);
      } else
      if(jsonBody.features.length == 0){
            callback("Lo sentimos el lugar no fue encontrado", undefined)
      }
      //Sin errores
      else{
        let coordinates = {
          long: jsonBody.features[0].center[0],
          lat: jsonBody.features[0].center[1]
        }
        callback(undefined, coordinates)
      }
    });
  }


  //Funcion para llamar desde el servidor
  const weather = function(city, callback){
    getGeo(city, function(error,response){
      if(error){
        callback(error, undefined);
      }
      else{
        //Una vez que se tienen las coordenadas, podemos obtener los datos climaticos
        getWeather(response.lat, response.long, function(error, response){
          if(error){
            callback(error, undefined);
          }else{
            callback(undefined,`${response.summary} Actualmente está a ${response.temperature}° C. Hay ${response.precipProbability * 100}% de posibilidad de lluvia.`);
          }
        });
      }
    });
  };

  module.exports = {
    weather: weather
  }
