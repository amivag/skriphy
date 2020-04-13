import React from "react";

import { IconSVGSearch, IconSVGClear } from "./Icons";

const MIN_SEARCH_TERM_CHARS = 3;

export const SearchBox = ({
  searchInputValue,
  setSearchInputValue,
  initiateGiphyAPISearchOnTerm,
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
              initiateGiphyAPISearchOnTerm(searchInputValue);
            } else {
              console.log("Search term too short!");
            }
          }}
        >
          <IconSVGSearch />
        </button>
        <button
          disabled={searchInputValue.length === 0}
          className="btn clear-search"
          type="button"
          onClick={() => {
            setSearchInputValue("");
          }}
        >
          <IconSVGClear />
        </button>
      </div>
    </form>
  );
};
