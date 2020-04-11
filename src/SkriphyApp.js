import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";

import { GIFGallery } from "./components/GIFGallery.jsx";
import { SearchBox } from "./components/SearchBox.jsx";

import "./styles/SkriphyApp.css";

const API_STATUS = {
  LOADING: "loading",
  IDLE: "idle",
  SUCCESS: "success",
  ERROR: "error",
};

let giphyAPIKey = "xIuBoWebXJkrn7kaq9jWPrZk6u6prPPy";

function getDataFromLocal() {
  const localImageObjects = localStorage.getItem("imageObjects");
  const localHiddenImageIds = localStorage.getItem("hiddenImageIds");
  const localSearchTerm = localStorage.getItem("searchTerm");
  return {
    localImageObjects,
    localHiddenImageIds,
    localSearchTerm,
  };
}

function SkriphyApp() {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // We use a "search last performed timestamp", to be able to trigger useEffect
  //  multiple times on the same search term
  const [
    searchLastPerformedTimestamp,
    setSearchLastPerformedTimestamp,
  ] = useState(0);
  const [apiResults, setApiResults] = useState([]);
  const [apiResultsHiddenIds, setApiResultsHiddenIds] = useState([]);
  const [apiLoadingStatus, setAPILoadingStatus] = useState(API_STATUS.IDLE);

  useEffect(() => {
    const {
      localImageObjects,
      localHiddenImageIds,
      localSearchTerm,
    } = getDataFromLocal();

    if (localImageObjects) {
      setApiResults(JSON.parse(localImageObjects));
      setAPILoadingStatus(API_STATUS.SUCCESS);
    }
    if (localSearchTerm) {
      setSearchInputValue(localSearchTerm);
    }
    if (localHiddenImageIds) {
      setApiResultsHiddenIds(JSON.parse(localHiddenImageIds));
    }
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      setAPILoadingStatus(API_STATUS.LOADING);
      setApiResultsHiddenIds([]);

      const artificialDelayMilliseconds = 1000;
      setTimeout(function () {
        // https://developers.giphy.com/docs/api/endpoint/#search
        const result = axios(
          `https://api.giphy.com/v1/gifs/search?api_key=${giphyAPIKey}&q=${searchTerm}`
        );
        result
          .then((results) => {
            const imagesData = results?.data?.data;
            if (!imagesData) {
              // error in received data
            }
            localStorage.setItem("imageObjects", JSON.stringify(imagesData));
            localStorage.setItem("searchTerm", searchTerm);
            localStorage.setItem("hiddenImageIds", "");
            setAPILoadingStatus(API_STATUS.SUCCESS);
            setApiResults(imagesData);
          })
          .catch((e) => {
            setAPILoadingStatus(API_STATUS.ERROR);
            const errorMsg = `Error: ${e}`;
            window.alert(errorMsg); // TODO: useState
            //console.log(errorMsg);
          });
      }, artificialDelayMilliseconds);
    }
  }, [searchLastPerformedTimestamp]);

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
              setSearchLastPerformedTimestamp,
            }}
          />
        </section>
        <section className="search-results">
          {apiLoadingStatus === API_STATUS.LOADING && (
            <div className="loading">
              <span>SEARCHING...</span>
            </div>
          )}
          {apiLoadingStatus === API_STATUS.ERROR && (
            <div className="error">
              <span>
                Oops... there was an error with your request, maybe try again?
              </span>
            </div>
          )}
          {apiLoadingStatus === API_STATUS.SUCCESS && (
            <Fragment>
              <h2 className="title">
                Results for '{searchTerm}' ({apiResults.length})
              </h2>
              <GIFGallery
                giphyGalleryItems={apiResults}
                hiddenItemIds={apiResultsHiddenIds}
                removeItemById={(itemId) => {
                  //console.log(`Attempting to remove item id ${itemId}`);
                  const updatedHiddenIds = [...apiResultsHiddenIds, itemId];
                  setApiResultsHiddenIds(updatedHiddenIds);
                  localStorage.setItem(
                    "hiddenImageIds",
                    JSON.stringify(updatedHiddenIds)
                  );
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
