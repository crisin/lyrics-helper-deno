import React, { useEffect, useState } from "react";

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

function WebPlayback(props: any) {
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const [current_track, setTrack] = useState(track);
  const [searchHistory, setSearchHistory] = useState([]);
  const [nothingPlayingError, setNothingPlayingError] = useState(false);

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://sdk.scdn.co/spotify-player.js";
//     script.async = true;

//     document.body.appendChild(script);

//     window.onSpotifyWebPlaybackSDKReady = () => {
//       const player = new window.Spotify.Player({
//         name: `Lyrics Helper ${props.appInstanceId}`,
//         getOAuthToken: (cb) => {
//           cb(props.token);
//         },
//         volume: 0.5,
//       });

//       setPlayer(player);

//       player.addListener("ready", ({ device_id }) => {
//         console.log("Ready with Device ID", device_id);
//       });

//       player.addListener("not_ready", ({ device_id }) => {
//         console.log("Device ID has gone offline", device_id);
//       });

//       player.addListener("player_state_changed", (state) => {
//         if (!state) {
//           return;
//         }

//         setTrack(state.track_window.current_track);
//         setPaused(state.paused);

//         player.getCurrentState().then((state) => {
//           !state ? setActive(false) : setActive(true);
//         });
//       });

//       player.connect();
//     };
//   }, []);

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

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
      artists.forEach((artist: any) => (searchQuery = searchQuery + artist + " "));
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

  const searchHistorySong = (historySearchUrl: any) => {
    console.log("hist:;", historySearchUrl);
    window.open(historySearchUrl, "_blank");
  };

  return (
    <>
      {!is_active && (
        <div className="container">
          <div className="main-wrapper">
            <b> Player not active. Search always works. </b>
          </div>
        </div>
      )}

{/* todo: benötigt noch? lieber weglassen und auf lyrics konzentrieren */}
      {is_active && (
        <div className="container">
          <div className="main-wrapper">
            <img
              src={current_track.album.images[0].url}
              className="now-playing__cover"
              alt=""
            />

            <div className="now-playing__side">
              <div className="now-playing__name">{current_track.name}</div>
              <div className="now-playing__artist">
                {current_track.artists[0].name}
              </div>

              <button
                className="btn-spotify"
                onClick={() => {
                  player.previousTrack();
                }}
              >
                &lt;&lt;
              </button>

              <button
                className="btn-spotify"
                onClick={() => {
                  player.togglePlay();
                }}
              >
                {is_paused ? "PLAY" : "PAUSE"}
              </button>

              <button
                className="btn-spotify"
                onClick={() => {
                  player.nextTrack();
                }}
              >
                &gt;&gt;
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="container">
        <div className="main-wrapper">
          <button className="btn-spotify" onClick={() => searchCurrentSong()}>
            Search Lyrics
          </button>
          {nothingPlayingError && (
            <button
              className="error-button"
              onClick={() => setNothingPlayingError(false)}
            >
              nothing playing
            </button>
          )}
        </div>
      </div>

{/* todo: auslagern, styling */}
      <div className="search-history">
        {searchHistory.length > 0 && <h3>History</h3>}
        {searchHistory.map((search: any) => (
          <div key={search.track} className="search-history-item">
            <img
              src={search.imgUrl}
              className="now-playing__cover history-item-cover"
              alt=""
              style={{ width: 100, height: 100 }}
              onClick={() => searchHistorySong(search.url)}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p>{search.track}</p>
              <p style={{ fontSize: 20 }}>{search.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default WebPlayback;
