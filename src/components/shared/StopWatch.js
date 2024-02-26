import React, { useState, useEffect } from "react";
import "../../styles/App.css";

const Stopwatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      setStartTime(Date.now() - elapsedTime);
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, elapsedTime, startTime]);

  const startStopwatch = () => {
    setIsRunning(true);
    setStartTime(Date.now() - elapsedTime);
  };

  const stopStopwatch = () => {
    setIsRunning(false);
  };

  const resetStopwatch = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
  };

  const recordLap = () => {
    const currentLapTime = elapsedTime;
    const lap = formatTime(currentLapTime);
    setLaps([...laps, lap]);
  };

  const formatTime = (time) => {
    const totalMilliseconds = Math.floor(time);
    const minutes = Math.floor(totalMilliseconds / (1000 * 60));
    const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((totalMilliseconds % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <h2>Stoppuhr</h2>
      <p>{formatTime(elapsedTime)}</p>
      <button onClick={isRunning ? stopStopwatch : startStopwatch}>
        {isRunning ? "Anhalten" : "Starten"}
      </button>
      <button onClick={resetStopwatch}>Zurücksetzen</button>
      <button onClick={recordLap} disabled={!isRunning}>
        Runde aufzeichnen
      </button>
      <ul>
        {laps.map((lap, index) => (
          <li key={index}>
            Runde {index + 1}: {lap}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stopwatch;
