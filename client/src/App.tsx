import { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login.tsx";
import WebPlayback from "./WebPlayback.tsx";

const s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

function App() {
  const appInstanceId = s4();

  const [token, setToken] = useState("");

  useEffect(() => {
    async function getToken() {
      const response = await fetch("/auth/token");
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();
  }, []);

  return (
    <>
      <div style={{ display: "flex" }}>
        <h1 style={{ paddingLeft: 30 }}>Lyrics Helper</h1>
        <p className="instance-name">{appInstanceId}</p>
      </div>
      {token === "" ? (
        <Login />
      ) : (
        <>
          <WebPlayback token={token} appInstanceId={appInstanceId} />
        </>
      )}
    </>
  );
}

export default App;
