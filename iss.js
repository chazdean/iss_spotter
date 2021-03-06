const request = require('request');

//Makes a single API request to retrieve the user's IP address.

const fetchMyIP = callback => {
  const url = `https://api.ipify.org?format=json`;
  
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

//Makes a single API request to retrieve the lat/lng for a given IPv4 address.

const fetchCoordsByIp = (ip, callback) => {
  const url = `https://freegeoip.app/json/${ip}`;
  
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const {latitude, longitude} = JSON.parse(body);
    callback(null, {latitude, longitude});
  });
};

//Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.

const fetchISSFlyOverTimes = (coords, callback) => {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
  
    const flyoverTimes = JSON.parse(body).response;
    callback(null, flyoverTimes);
  });
};

//Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.

const nextISSTimesForMyLocation = (callback) => {
  
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIp(ip,(error, loc) => {
      if (error) {
        return callback(error, null);
      }
    
      const inputCoords = loc;
      fetchISSFlyOverTimes(inputCoords, (error, coordinates) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, coordinates);
      });
    });
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIp,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};