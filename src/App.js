import "./App.css";
import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import AnalogClock from "analog-clock-react";

const API_ENDPOINT = "http://localhost:5005";

function App() {
  const [time, setTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [connection, setConnection] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    let socket;
    if (connection) {
      setConnecting(true);
      socket = socketIOClient(API_ENDPOINT, { path: "/clock" });

      socket.on("tick", (time) => {
        setTime(time);
      });
      setConnecting(false);
    }

    if (!connection && socket) {
      socket.disconnect();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [connection]);

  const clockOption = {
    width: "350px",
    border: true,
    borderColor: "#ffffff44",
    baseColor: "#17a2b8",
    centerColor: "#459cff",
    centerBorderColor: "#ffffff",
    handColors: {
      second: "#d81c7a",
      minute: "#ffffff",
      hour: "#ffffff",
    },
  };

  return (
    <div className="App">
      <header className="App-header">
        <AnalogClock
          useCustomTime={true}
          hours={time.hours}
          minutes={time.minutes}
          seconds={time.seconds}
          {...clockOption}
        />
        <p>
          {`${time.hours <= 12 ? time.hours : time.hours - 12}`.padStart(2, 0)}:
          {`${time.minutes}`.padStart(2, 0)}:{`${time.seconds}`.padStart(2, 0)}{" "}
          {time.hours < 12 ? "AM" : "PM"}
        </p>
        <div>
          <button onClick={() => setConnection(!connection)}>
            {connecting
              ? "Connecting..."
              : connection
              ? "Disconnect"
              : "Synchronize Clock With Server"}
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
