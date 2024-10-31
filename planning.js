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

// Usage example
const airportsData = readCsv('airports.csv');
if (airportsData) {
    airportsData.forEach(row => {
        console.log(row);
    });
}

const aeroplaneData = readCsv('aeroplanes.csv');
if (aeroplaneData) {
    aeroplaneData.forEach(row => {
        console.log(row);
    });
}


const valid_flight_data = readCsv('valid_flight_data.csv');
if (valid_flight_data) {
    valid_flight_data.forEach(row => {
        console.log(row);
    });
}

function revenue(valid_flight_data){
    const listRev = []
    for(row of valid_flight_data){
        const economy = row[3]*row[6]
        const business = row[4]*row[7]
        const first = row[5]*row[8]
        const total = economy+business+first
        listRev.push(total.toFixed(2))
    }
    return listRev
}

function distance (airportsData, valid_flight_data){
    const distances = []
    for (flight of valid_flight_data) {
        const departureAirport = flight[0];
        const arrivalAirport = flight[1];
        const airportData = airportsData.find(airport => airport[0] === arrivalAirport);
        if (airportData) {
            if (departureAirport === 'MAN') {
              distances.push(airportData[2]); // Distance from MAN
            } else if (departureAirport === 'LGW') {
              distances.push(airportData[3]); // Distance from LGW
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
      const aeroplane = aeroplaneData.find(plane => plane[0] === aircraftType);
      if (aeroplane) {
        const runningCostPerSeatPer100km = parseFloat(aeroplane[1].replace('£', ''));
        const economySeats = parseInt(flight[3]);
        const businessSeats = parseInt(flight[4]);
        const firstSeats = parseInt(flight[5]);
        const allSeats = economySeats + businessSeats + firstSeats;
        const totalCost = (runningCostPerSeatPer100km * flightDistance * allSeats) / 100;
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

console.log(revenue(valid_flight_data)) //prints list of revenues for each valid flight
console.log(distance(airportsData, valid_flight_data)) //prints list of distances for each valid flight
console.log(cost(aeroplaneData, valid_flight_data))
console.log(profitLoss())