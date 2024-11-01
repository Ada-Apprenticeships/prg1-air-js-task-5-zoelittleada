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

    // finds match between index 0 in airports and arrival airport in filght data
    const foundAirport = airportsData.find(airport => airport[0] === arrivalAirport);
    if (!foundAirport) { // executes if match is found 
      flightError = `The arrival airport code for this flight is invalid (${arrivalAirport})`;
    }

    // Find match between index 0 in aeroplane data and aircraft type
    const plane = aeroplanesData.find(plane => plane[0] === aircraftType);
    if (plane) { // execute if match is found
      const maxRange = parseInt(plane[2]);
      const maxEconomy = parseInt(plane[3]);
      const maxBusiness = parseInt(plane[4]);
      const maxFirst = parseInt(plane[5]);

      // Handle too many seats being sold
      if (economySeats > maxEconomy) {
        flightError = `${economySeats-maxEconomy} too many economy seats have been sold (${economySeats}>${maxEconomy})`;
      } else if (businessSeats > maxBusiness) {
        flightError = `${businessSeats-maxBusiness} too many business seats have been sold (${businessSeats}>${maxBusiness})`;
      } else if (firstSeats > maxFirst) {
        flightError = `${firstSeats-maxFirst} too many first class seats have been sold (${firstSeats}>${maxFirst})`;
      }

      // Handle flight range error
      let distance = 0;
      if (foundAirport) { 
        if (departureAirport === 'MAN') {
          distance = parseFloat(foundAirport[2]);
        } else if (departureAirport === 'LGW') {
          distance = parseFloat(foundAirport[3]);
        }

        if (distance > maxRange) {
          flightError = `A ${aircraftType.toLowerCase()} aircraft doesn't have the range for this flight`;
        }
      }

      // Calculate profit/loss if no errors so far (used previous code)
      if (!flightError) { 
        const runningCostPerSeatPer100km = parseFloat(plane[1].replace('£', ''));
        const allSeats = economySeats + businessSeats + firstSeats; 
        const totalCost = (runningCostPerSeatPer100km * distance * allSeats) / 100; // formula for cost of flight
        const profitLoss = totalRev - totalCost;
        flightDetails.push(`This flight will be from ${departureAirport} to ${arrivalAirport} on a ${aircraftType.toLowerCase()} aircraft and has an expected profit of £${profitLoss.toFixed(2)}`);
      }
    }

    // Push error message if there is one
    if (flightError) {
      flightDetails.push(flightError);
    } 
  }
  // writing to a txt file 
  const fs = require('fs')
    const fileDetails = flightDetails.join('\n');
    fs.writeFile('Output.txt', fileDetails, (err) => {
        if (err) throw err;
    })
  return flightDetails;
}

console.log(details (airportsData, aeroplaneData, allFlightData))