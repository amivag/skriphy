import React from "react";

export const SearchBox = ({
  searchInputValue,
  setSearchInputValue,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <form className="giphy-search-form">
      <label>
        <input
          className="search-input"
          type="text"
          name="name"
          placeholder="Search for Giphies..."
          value={searchInputValue}
          onChange={(e) => {
            const val = e.target.value;
            setSearchInputValue(val);
          }}
        />
      </label>
      <button
        className="btn submit"
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          console.log("Submit!");
          setSearchTerm("");
          if (searchInputValue.length > 0) {
            setSearchTerm(searchInputValue);
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
    </form>
  );
};
