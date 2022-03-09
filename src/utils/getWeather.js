import { get } from "./xhr";

const apiUrl = "//api.openweathermap.org/data/2.5/weather";
const appId = "0ff471d1592b62731c517ae02b95d96c";
const units = "metric";
const tenMinutesInMillis = 600000;
const queryMap = {};

const getWeather = (query) => {
  return new Promise((resolve, reject) => {
    const existingQueryData = queryMap[query];
    const now = Date.now();

    // Ensure we only make 1 API request per 10 minutes for a specific query, since
    // the API data only changes once every 10 minutes.
    if (
      existingQueryData &&
      now - existingQueryData.timestamp < tenMinutesInMillis
    ) {
      // Use existing weather data matching this query, since we've requested the same data
      // within a 10 minute timespan.
      console.log("using existing data", { existingQueryData });
      resolve(existingQueryData.weather);
    } else {
      // Request new weather data from the API.
      console.log("requesting new data");
      const requestUrl = `${apiUrl}?APPID=${appId}&q=${query}&units=${units}`;
      get(requestUrl, (res) => {
        let data;
        if (res.cod === 200) {
          // Rain units are millimeters.
          const hourlyRainfall = (res.rain && res.rain["1h"]) || 0;
          const threeHourlyRainfall = (res.rain && res.rain["3h"]) || 0;
          const rain = hourlyRainfall || threeHourlyRainfall || 0;

          // Snow units are millimeters.
          const hourlySnowfall = (res.snow && res.snow["1h"]) || 0;
          const threeHourlySnowfall = (res.snow && res.snow["3h"]) || 0;
          const snow = hourlySnowfall || threeHourlySnowfall || 0;

          data = {
            ok: true,
            locationName: res.name,
            temperature: {
              value: Math.round(res.main.temp),
              units: units === "metric" ? "celcius" : "fahrenheit"
            },
            rain: {
              value: rain,
              units: "mm"
            },
            snow: {
              value: snow,
              units: "mm"
            }
          };
        } else {
          reject(
            new Error(`Error fetching data:\n${JSON.stringify(res, null, 2)}`)
          );
          return;
        }
        // Store the data for this query in the map with a timestamp (even for 404 responses).
        // TODO : if the request fails (i.e. not 404, but full failure), then we should not store the response.
        queryMap[query] = {
          timestamp: Date.now(),
          weather: data
        };
        resolve(data);
      });
    }
  });
};

export default getWeather;
