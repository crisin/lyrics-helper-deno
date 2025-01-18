import { useState } from "react";
import SearchHistory from "./SearchHistory.tsx";

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

// todo: typing

function WebSearch(props: any) {
  const [current_track, setTrack] = useState(track);
  const [searchHistory, setSearchHistory] = useState([]);
  const [nothingPlayingError, setNothingPlayingError] = useState(false);

  const searchCurrentSong = async () => {
    try {
      let track;

      if (current_track.name !== "") {
        track = current_track;
      } else {
        const csRequest = await fetch("https://api.spotify.com/v1/me/player", {
          headers: {
            Authorization: "Bearer " + props.token,
          },
        });
        const remoteCurrentSong = await csRequest.json();
        track = remoteCurrentSong.item;
      }

      const artists = track.artists.map((artist: any) => artist.name);
      const trackName = track.name;

      let searchQuery = "";
      artists.forEach(
        (artist: string) => (searchQuery = searchQuery + artist + " ")
      );
      searchQuery = searchQuery + trackName + " lyrics";

      searchQuery = encodeURIComponent(searchQuery);

      const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
      const historyItem = {
        url: searchUrl,
        artist: artists[0],
        track: trackName,
        imgUrl: track.album.images[0].url,
      };
      if (!searchHistory.find((hist: any) => hist.url === historyItem.url)) {
        setSearchHistory([historyItem, ...searchHistory]);
      }

      window.open(searchUrl, "_blank");
    } catch (error) {
      setNothingPlayingError(true);
    }
  };

  const searchHistorySong = (historySearchUrl: string) => {
    console.log("hist:;", historySearchUrl);
    window.open(historySearchUrl, "_blank");
  };

  return (
    <div style={{ backgroundColor: "green" }}>
      <div className="container" >
        <div className="main-wrapper">
          {!nothingPlayingError && (
            <button className="btn-spotify" onClick={() => searchCurrentSong()}>
              Search Lyrics
            </button>
          )}

          {nothingPlayingError && (
            <>
              <span>nothing playing</span>
              <button
                className="error-button"
                onClick={() => setNothingPlayingError(false)}
              >
                {"\u00D7"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* todo: auslagern, styling */}
      <SearchHistory
        searchHistory={searchHistory}
        searchHistorySong={searchHistorySong}
      />
    </div>
  );
}

export default WebSearch;
