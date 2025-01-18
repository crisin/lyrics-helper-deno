import { useEffect, useState } from "react";
import { re } from "../../../../../Users/chris/AppData/Local/deno/npm/registry.npmjs.org/semver/6.3.1/semver.js";
import { json } from "node:stream/consumers";

function Lyrics() {
  const [lyrics, setLyrics] = useState([]);
  // todo: auf serverseitige methoden zugreifen

  // todo: lyrics aus db holen

  useEffect(() => {
    // todo: lyrics anzeigen

    const fetchSongs = async () => {
      const data = await fetch("/songs");
      const json = await data.json();

      setLyrics(json.songs);
    };
    fetchSongs();
  }, []);

  return (
    <div>
      <p>Lyrics</p>
      {lyrics.map((l: any) => (
        <p>{JSON.stringify(l)}</p>
      ))}
    </div>
  );
}

export default Lyrics;
