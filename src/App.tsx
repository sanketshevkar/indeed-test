import { FC, useEffect, useState } from "react";
import getWeather from "./utils/getWeather";

const App: FC = () => {
  const [temperature, setTemperature] = useState({
    value: 0,
    units: ""
  });
  const [city, setCity] = useState("");
  const [newCity, setNewCity] = useState("");
  const [color, setColor] = useState("");
  const history = [];
  useEffect(() => {
    getWeather("bali")
      .then((data) => {
        console.log(data);
        setTemperature(data.temperature);
        setCity(data.locationName);
        setBackground(data.temperature.value);
        history.push(data.locationName);
        localStorage.setItem("history", history);
      })
      .catch((error) => console.log(error));
  }, []);

  const getTemperature = (e: MouseEvent) => {
    e.preventDefault();
    getWeather(newCity)
      .then((data) => {
        console.log(data);
        setTemperature(data.temperature);
        setCity(data.locationName);
        setBackground(data.temperature.value);
        history.push(data.locationName);
        localStorage.setItem("history", history);
      })
      .catch((error) => console.log(error));
  };

  const setBackground = (temperatureValue) => {
    if (temperatureValue <= 0) {
      setColor("darkBlue");
    } else if (temperatureValue <= 8) {
      setColor("lightBlue");
    } else if (temperatureValue <= 16) {
      setColor("yellow");
    } else if (temperatureValue <= 24) {
      setColor("orange");
    } else {
      setColor("red");
    }
  };

  const getHistory = () => {
    const currentHistory = localStorage.getItem("history");
    console.log(currentHistory);
  };
  return (
    <div style={{ background: color, transition: "background 1s" }}>
      <form onSubmit={(e) => getTemperature(e)}>
        <input
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          type="text"
        />
        <br />
        <button type="submit">Get City Temperature</button>
      </form>
      <p>
        <span>City Name: </span> {city}
      </p>
      <p>
        <span>Temperature: </span> {temperature.value} {temperature.units}
      </p>
      <button onClick={getHistory}>Get History</button>
    </div>
  );
};

export default App;
