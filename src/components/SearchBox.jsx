import React from "react";

const MIN_SEARCH_TERM_CHARS = 3;

export const SearchBox = ({
  searchInputValue,
  setSearchInputValue,
  setSearchTerm,
  setSearchLastPerformedTimestamp,
}) => {
  const isSearchActionAllowed =
    searchInputValue.length > 0 &&
    searchInputValue.length >= MIN_SEARCH_TERM_CHARS;
  return (
    <form className="giphy-search-form">
      <label className="search-input-label">
        <input
          className="search-input"
          type="text"
          name="searchInput"
          placeholder="Search for Giphies..."
          value={searchInputValue}
          onChange={(e) => {
            const val = e.target.value;
            setSearchInputValue(val);
          }}
        />
      </label>
      <div className="search-actions">
        <button
          disabled={!isSearchActionAllowed}
          className="btn submit"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            if (isSearchActionAllowed) {
              setSearchTerm(searchInputValue);
              setSearchLastPerformedTimestamp(Date.now());
            } else {
              console.log("Search term too short!");
            }
          }}
        >
          Go
        </button>
        <button
          className="btn clear-search"
          type="button"
          onClick={() => {
            //setSearchTerm("");
            setSearchInputValue("");
          }}
        >
          Clear
        </button>
      </div>
    </form>
  );
};
