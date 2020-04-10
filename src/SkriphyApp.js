import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import "./styles/SkriphyApp.css";

const STATUS_LOADING = "loading";
const STATUS_IDLE = "idle";
//const STATUS_SUCCESS = "success";
const STATUS_ERROR = "error";

let giphyAPIKey = "xIuBoWebXJkrn7kaq9jWPrZk6u6prPPy";

function SkriphyApp() {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [apiResults, setApiResults] = useState([]);
  const [apiLoadingStatus, setAPILoadingStatus] = useState(STATUS_IDLE);

  useEffect(() => {
    setAPILoadingStatus(STATUS_LOADING);
    // https://developers.giphy.com/docs/api/endpoint/#search
    const result = axios(
      `https://api.giphy.com/v1/gifs/search?api_key=${giphyAPIKey}&q=${searchTerm}`
    );

    result
      .then((results) => {
        setAPILoadingStatus(STATUS_IDLE);
        const imagesData = results.data.data;
        setApiResults(imagesData);
        //console.log(imagesData)
      })
      .catch((e) => {
        setAPILoadingStatus(STATUS_ERROR);
        const errorMsg = `Error: ${e}`;
        window.alert(errorMsg);
        console.log(errorMsg);
      });
    //setImagesCollection(result.data);
  }, [searchTerm]);

  return (
    <div className="SkriphyApp">
      <header className="App-header">
        <h1 className="title">SKRIPHY</h1>
      </header>
      <main>
        <section className="giphy-search">
          <form className="giphy-search-form">
            <label>
              <input
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
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                console.log("Submit!");
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
              type="button"
              onClick={() => {
                //setSearchTerm("");
                setSearchInputValue("");
              }}
            >
              Clear
            </button>
          </form>
        </section>
        <section className="search-results">
          {apiResults.length > 0 && apiLoadingStatus === STATUS_IDLE && (
            <Fragment>
              <h2>
                Results for '{searchTerm}': {apiResults.length} GIFs
              </h2>

              <ul className="items-list">
                {apiResults.map((item) => {
                  const itemId = item?.id;
                  const urlGifPreview = item?.images?.preview_gif?.url;
                  return (
                    <li className="item" key={itemId}>
                      <img
                        className="img"
                        src={urlGifPreview}
                        alt={urlGifPreview}
                      />
                    </li>
                  );
                })}
              </ul>
            </Fragment>
          )}
        </section>
      </main>
      <footer>GIPHY search by Vangelis Erotokritakis (April 2020)</footer>
    </div>
  );
}

export default SkriphyApp;
