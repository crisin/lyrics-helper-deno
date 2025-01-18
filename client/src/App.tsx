import { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login.tsx";
import WebPlayback from "./WebPlayback.tsx";
import { s4 } from "./util/s4.ts";

function App() {
  const appInstanceId = s4();

  const [token, setToken] = useState("");

  useEffect(() => {
    // todo: auth-flow überdenken und ggf anpassen

    // todo: wie state-management angehen? zustand vlt?
    async function getToken() {
      const response = await fetch("/auth/token");
      const json = await response.json();
      setToken(json.access_token);
    }

    // todo: Supabase-Backend einbinden und Daten (History, Favoriten, gespeicherte Lyrics laden)

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
          {/* todo: logout-button, profil-seite */}
          <WebPlayback token={token} appInstanceId={appInstanceId} />
        </>
      )}
    </>
  );
}

export default App;
