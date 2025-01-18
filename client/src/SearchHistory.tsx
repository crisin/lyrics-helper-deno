function SearchHistory({searchHistory, searchHistorySong}: {searchHistory: any, searchHistorySong:any}) {
  return (
    <div className="search-history">
      <h3>Search history</h3>
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
  );
}
export default SearchHistory;
