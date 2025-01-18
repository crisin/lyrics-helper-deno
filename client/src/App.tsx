import { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login.tsx";
import WebPlayback from "./WebSearch.tsx";
import { s4 } from "./util/s4.ts";
import Lyrics from "./Lyrics.tsx";

function App() {
  const appInstanceId = s4();

  const [token, setToken] = useState("");

  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    // todo: auth-flow überdenken und ggf anpassen

    // todo: wie state-management angehen? zustand vlt?

    // todo: anstelle von token fetchen nur BE callen?
    async function getToken() {
      console.log("getToken");
      const response = await fetch("/auth/token");
      const json = await response.json();
      setToken(json.access_token);
    }

    // todo: Supabase-Backend einbinden und Daten (History, Favoriten, gespeicherte Lyrics laden)
    if (window.location.port === "3000") {
      setDevMode(true);
      setToken("devmode");
    } else {
      getToken();
    }
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
          {/* todo: logout-button, profil-seite */}
          <WebPlayback token={token} appInstanceId={appInstanceId} />
          <Lyrics />
        </>
      )}
    </>
  );
}

export default App;
