const { Console } = require('console');
const fs = require('fs');

function readCsv(filename, delimiter = ',') {
    try {
        const fileContent = fs.readFileSync(filename, { encoding: 'utf-8' });
        const rows = fileContent.split('\n');
        const data = [];
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].trim();
            if (row) {
                const columns = row.split(delimiter);
                data.push(columns);
            }
        }
        return data;
    } catch (err) {
        console.error("Error reading file:", err.message);
        return null;
    }
}

const airportsData = readCsv('airports.csv');
const aeroplaneData = readCsv('aeroplanes.csv');
const valid_flight_data = readCsv('valid_flight_data.csv');
const invalid_flight_data = readCsv('invalid_flight_data.csv');
const allFlightData = valid_flight_data.concat(invalid_flight_data); //concatenates both csvs


function details(airportsData, aeroplanesData, allFlightData) {
  const flightDetails = [];

  for (const row of allFlightData) {
    const departureAirport = row[0];
    const arrivalAirport = row[1];
    const aircraftType = row[2];
    const economySeats = row[3];
    const businessSeats = row[4];
    const firstSeats = row[5];
    const totalRev = (row[3] * row[6]) + (row[4] * row[7]) + (row[5] * row[8]);

    let flightError = ""; //makes sure error message only pushed once for each flight

    // Handle invalid airport code
    const foundAirport = airportsData.find(airport => airport[0] === arrivalAirport);
    if (!foundAirport) {
      flightError = `The arrival airport code for this flight is invalid (${arrivalAirport})`;
    }

    // Find matching aeroplane type
    const plane = aeroplanesData.find(plane => plane[0] === aircraftType);
    if (plane) {
      const maxRange = parseInt(plane[2]);
      const maxEconomy = parseInt(plane[3]);
      const maxBusiness = parseInt(plane[4]);
      const maxFirst = parseInt(plane[5]);

      // Handle too many seats being sold
      if (economySeats > maxEconomy) {
        flightError = `Too many economy seats have been sold`;
      } else if (businessSeats > maxBusiness) {
        flightError = `Too many business seats have been sold`;
      } else if (firstSeats > maxFirst) {
        flightError = `Too many first class seats have been sold`;
      }

      // Handle flight range error
      let distance = 0;
      if (foundAirport) { // Use foundAirport from the airport code check
        if (departureAirport === 'MAN') {
          distance = parseFloat(foundAirport[2]);
        } else if (departureAirport === 'LGW') {
          distance = parseFloat(foundAirport[3]);
        }
        if (distance > maxRange) {
          flightError = `A ${aircraftType} doesn't have the range for this flight`;
        }
      }
    }

    // Push error message or flight details
    if (flightError) {
      flightDetails.push(flightError);
    } 
  }

  return flightDetails;
}

console.log(details (airportsData, aeroplaneData, allFlightData))

/*
function revenue(valid_flight_data){
    const listRev = []
    for(row of valid_flight_data){
        //revenue from all economy, business and first class seats
        const economy = row[3]*row[6] 
        const business = row[4]*row[7] 
        const first = row[5]*row[8] 
        const total = economy+business+first
        listRev.push(total.toFixed(2)) //rounds to 2 decimal places 
    }
    return listRev
}

function distance (airportsData, valid_flight_data){
    const distances = []
    for (flight of valid_flight_data) {
        const departureAirport = flight[0]; 
        const arrivalAirport = flight[1];
        // finds a match between index 0 in airports csv and arrival airport in valid_flight_data
        const airportData = airportsData.find(airport => airport[0] === arrivalAirport); 
        if (airportData) { //will execute if a match is found
            if (departureAirport === 'MAN') {
              distances.push(airportData[2]); // gets distance from MAN
            } else if (departureAirport === 'LGW') {
              distances.push(airportData[3]); // get distance from LGW
            }
        }
    }
    return distances
}

function cost(aeroplaneData, valid_flight_data) {
    const costs = [];
    for (let i = 0; i < valid_flight_data.length; i++) { 
      const flight = valid_flight_data[i];
      const aircraftType = flight[2]; // Get aircraftType from flight
      const distances = distance(airportsData, valid_flight_data);
      const flightDistance = distances[i]; 
      // finds a match between index 0 in aeroplanes csv data and aircraft type in valid_flight_data
      const aeroplane = aeroplaneData.find(plane => plane[0] === aircraftType);
      if (aeroplane) { //will execute if a match is found
        const runningCostPerSeatPer100km = parseFloat(aeroplane[1].replace('£', '')); //removes £ and makes it an integer
        const economySeats = parseInt(flight[3]);
        const businessSeats = parseInt(flight[4]);
        const firstSeats = parseInt(flight[5]);
        const allSeats = economySeats + businessSeats + firstSeats; 
        const totalCost = (runningCostPerSeatPer100km * flightDistance * allSeats) / 100; //calculation for total cost of flight
        costs.push(totalCost.toFixed(2)); 
      } 
    }
    return costs;
  }

function profitLoss(){
    const revenues = revenue(valid_flight_data); 
    //console.log(revenues)
    const costs = cost(aeroplaneData, valid_flight_data); 
    //console.log(costs)
    const profits = [];
    for (let i = 0; i < revenues.length; i++) { 
        const totalProfit = revenues[i] - costs[i];
        profits.push(totalProfit.toFixed(2));
      }
    return profits
}

function flightDetail (valid_flight_data){
    const profits = profitLoss(); 
    const details = []
    for (let i = 1; i < valid_flight_data.length; i++){
        details.push(`This flight will be from ${valid_flight_data[i][0]} to ${valid_flight_data[i][1]} on a ${valid_flight_data[i][2]} aircraft and has an expected profit of £${profits[i]}`)
    }
    //writes flight details to output.txt file
    const fs = require('fs')
    const fileDetails = details.join('\n');
    fs.writeFile('Output.txt', fileDetails, (err) => {
        if (err) throw err;
    })
    return details
}
*/


// not working, keep getting undici-types error
/*
function error (invalid_flight_data, aeroplaneData, airportsData){
    const error = []
    //define maxrange 
    for (flight of invalid_flight_data) {
        const arrivalAirport = flight[1]
        const aircraftType = flight[2];
        const economySeats = parseInt(flight[3]);
        const businessSeats = parseInt(flight[4]);
        const firstSeats = parseInt(flight[5]);
        const plane = aeroplaneData.find(plane => plane[0] === aircraftType);
        const airport = airportsData.find(airport => airport[0] === arrivalAirport);
        if (plane) {
            const maxRange = parseInt(plane[2]);
            const maxEconomy = parseInt(plane[3]);
            const maxBusiness = parseInt(plane[4]);
            const maxFirst = parseInt(plane[5]);
            if (maxEconomy < economySeats){
                error.push('Too many economy seats have been sold')
            } else if (maxBusiness < businessSeats){
                error.push('Too many business seats have been sold')
            } else if (maxFirst < firstSeats){
                error.push('Too many economy seats have been sold')
            }
        }
        if (airport) {
            let distanceToArrival = 0;
            if (departureAirport === 'MAN') {
              distanceToArrival = airport[2]; 
            } else if (departureAirport === 'LGW') {
              distanceToArrival = airport[3];
            }
    
            if (distanceToArrival > maxRange) {
              errors.push(`${aircraftType} doesn't have the range to fly to ${arrivalAirport}`);
            }
          } 
        } 
    
        if (!airport) {
          errors.push(`${arrivalAirport} is an invalid airport code`);
        }
        return errors
    }
    */


//console.log(revenue(valid_flight_data)) //prints list of revenues for each valid flight
//console.log(distance(airportsData, valid_flight_data)) //prints list of distances for each valid flight
//console.log(cost(aeroplaneData, valid_flight_data)) //prints list of revenues for each valid flight
//console.log(profitLoss()) //prints list of profits for each valid flight
//console.log(flightDetail (valid_flight_data)) //prints list of details for each valid flight
//console.log(error (invalid_flight_data, aeroplaneData))