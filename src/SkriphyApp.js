import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";

import { GIFGallery } from "./components/GIFGallery.jsx";
import { SearchBox } from "./components/SearchBox.jsx";

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
  const [apiResultsHiddenIds, setApiResultsHiddenIds] = useState([]);
  const [apiLoadingStatus, setAPILoadingStatus] = useState(STATUS_IDLE);

  useEffect(() => {
    if (searchTerm.length > 0) {
      setAPILoadingStatus(STATUS_LOADING);
      setApiResultsHiddenIds([]);

      const artificialDelayMilliseconds = 1000;
      setTimeout(function () {
        //your code to be executed after 1 second

        // https://developers.giphy.com/docs/api/endpoint/#search
        const result = axios(
          `https://api.giphy.com/v1/gifs/search?api_key=${giphyAPIKey}&q=${searchTerm}`
        );
        result
          .then((results) => {
            setAPILoadingStatus(STATUS_IDLE);
            const imagesData = results.data.data;
            setApiResults(imagesData);
          })
          .catch((e) => {
            setAPILoadingStatus(STATUS_ERROR);
            const errorMsg = `Error: ${e}`;
            window.alert(errorMsg);
            console.log(errorMsg);
          });
      }, artificialDelayMilliseconds);
    }
  }, [searchTerm]);

  return (
    <div className="SkriphyApp">
      <header className="App-header">
        <h1 className="title">skriphy</h1>
      </header>
      <main>
        <section className="giphy-search">
          <SearchBox
            {...{
              searchInputValue,
              setSearchInputValue,
              searchTerm,
              setSearchTerm,
            }}
          />
        </section>
        <section className="search-results">
          {apiResults.length > 0 && apiLoadingStatus === STATUS_IDLE && (
            <Fragment>
              <h2 className="title">
                Results for '{searchTerm}': {apiResults.length} GIFs
              </h2>

              <GIFGallery
                giphyGalleryItems={apiResults}
                hiddenItemIds={apiResultsHiddenIds}
                removeItemById={(itemId) => {
                  console.log(`Attempting to remove item id ${itemId}`);
                  setApiResultsHiddenIds([...apiResultsHiddenIds, itemId]);
                }}
              />
            </Fragment>
          )}
        </section>
      </main>
      <footer>GIPHY search by Vangelis Erotokritakis (April 2020)</footer>
    </div>
  );
}

export default SkriphyApp;
