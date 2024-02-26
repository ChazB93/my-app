import React, { useState, useEffect } from "react";
import axios from "axios";

const Timer = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft > 0) {
            return prevTimeLeft - 1;
          } else {
            clearInterval(intervalId);
            setIsRunning(false);
            if (!notificationSent) {
              sendNotification();
              setNotificationSent(true);
            }
            return 0;
          }
        });
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, notificationSent]);

  const handleStart = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    setTimeLeft(totalSeconds);
    setIsRunning(true);
  };

  const handlePauseResume = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning); // Toggle the running state
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setNotificationSent(false); // Reset notification sent state
  };

  const formatTime = (timeInSeconds) => {
    const h = Math.floor(timeInSeconds / 3600);
    const m = Math.floor((timeInSeconds % 3600) / 60);
    const s = timeInSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const sendNotification = () => {
    const notificationData = {
      receiver: "bizindavyicharles93@gmail.com",
      subject: "Alarm hit",
      content: "Have a nice day",
    };

    axios
      .post(
        "https://prod-17.switzerlandnorth.logic.azure.com:443/workflows/3b6d3d7477dd4cbd85e6034a2a6b137a/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=KvoYC8v-VcvwSuGIyWGD6DD603NM28dnT6fzS9iTyrY",
        notificationData
      )
      .then((response) => {
        console.log("Notification sent successfully:", response);
      })
      .catch((error) => {
        console.error("Error sending notification:", error);
      });
  };

  return (
    <div>
      <h2>Zeitmesser</h2>
      <div>
        <label htmlFor="hours">Stunden:</label>
        <select
          id="hours"
          value={hours}
          onChange={(e) => setHours(parseInt(e.target.value))}
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        <label htmlFor="minutes">Minuten:</label>
        <select
          id="minutes"
          value={minutes}
          onChange={(e) => setMinutes(parseInt(e.target.value))}
        >
          {Array.from({ length: 60 }, (_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        <label htmlFor="seconds">Sekunden:</label>
        <select
          id="seconds"
          value={seconds}
          onChange={(e) => setSeconds(parseInt(e.target.value))}
        >
          {Array.from({ length: 60 }, (_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>
      <div>
        <p>Verbleibende Zeit: {formatTime(timeLeft)}</p>
      </div>
      <div>
        {/* Button label dynamically changes based on the running state */}
        <button onClick={isRunning ? handlePauseResume : handleStart}>
          {isRunning ? "Pause" : "Starten"}
        </button>
        <button onClick={handleReset}>Zurücksetzen</button>
      </div>
    </div>
  );
};

export default Timer;
