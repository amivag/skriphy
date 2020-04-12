import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";

import { GIFGallery } from "./components/GIFGallery.jsx";
import { SearchBox } from "./components/SearchBox.jsx";

import {
  getDataFromLocal,
  saveNewSearchDataToLocal,
  saveHiddenImageIds,
  resetLocalDataExceptAPIKey,
} from "./libs/clientStore";

import "./styles/SkriphyApp.css";

const API_STATUS = {
  LOADING: "loading",
  IDLE: "idle",
  SUCCESS: "success",
  ERROR: "error",
};

let giphyAPIKey = "xIuBoWebXJkrn7kaq9jWPrZk6u6prPPy"; //TODO: Make dynamic

function SkriphyApp() {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // We use a "search last performed" timestamp, to be able to trigger useEffect
  //  repeatedly on the same search term if wanted.
  const [
    searchLastPerformedTimestamp,
    setSearchLastPerformedTimestamp,
  ] = useState(0);
  const [apiResults, setApiResults] = useState([]);
  const [apiResultsHiddenIds, setApiResultsHiddenIds] = useState([]);
  const [apiLoadingStatus, setAPILoadingStatus] = useState(API_STATUS.IDLE);

  const resetApp = () => {
    resetLocalDataExceptAPIKey();
    setSearchInputValue("");
    setApiResults([]);
    setApiResultsHiddenIds([]);
    setAPILoadingStatus(API_STATUS.IDLE);
  };

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

      const artificialDelayMilliseconds = 1000; // for simulating slower network
      setTimeout(function () {
        // https://developers.giphy.com/docs/api/endpoint/#search
        const searchURL = `https://api.giphy.com/v1/gifs/search?api_key=${giphyAPIKey}&q=${searchTerm}`;
        const searchResult = axios(searchURL);
        searchResult
          .then((results) => {
            const imagesData = results?.data?.data;
            if (!imagesData) {
              // error in received data
            }
            saveNewSearchDataToLocal({
              searchTerm,
              imageObjects: imagesData,
            });
            setAPILoadingStatus(API_STATUS.SUCCESS);
            setApiResults(imagesData);
          })
          .catch((e) => {
            setAPILoadingStatus(API_STATUS.ERROR);
            const errorMsg = `Error: ${e}`;
            window.alert(errorMsg);
            console.log(errorMsg);
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
          {apiLoadingStatus === API_STATUS.IDLE && (
            <div className="state-idle">
              <span>Search for something...</span>
            </div>
          )}
          {apiLoadingStatus === API_STATUS.LOADING && (
            <div className="state-loading">
              <span>Searching...</span>
            </div>
          )}
          {apiLoadingStatus === API_STATUS.ERROR && (
            <div className="state-error">
              <span>
                Oops... there was an error with your request, maybe try again?
              </span>
            </div>
          )}
          {apiLoadingStatus === API_STATUS.SUCCESS && (
            <div className="state-success">
              <h2 className="title">
                Results for '{searchTerm}' ({apiResults.length})
              </h2>
              <GIFGallery
                giphyGalleryItems={apiResults}
                hiddenItemIds={apiResultsHiddenIds}
                removeItemById={(itemId) => {
                  const updatedHiddenIds = [...apiResultsHiddenIds, itemId];
                  setApiResultsHiddenIds(updatedHiddenIds);
                  saveHiddenImageIds(updatedHiddenIds);
                }}
              />
            </div>
          )}
        </section>
      </main>
      <footer>
        GIPHY search by Vangelis Erotokritakis (April 2020) |{" "}
        <button type="button" className="btn reset-app" onClick={resetApp}>
          Reset Everything!
      </footer>
    </div>
  );
}

export default SkriphyApp;
