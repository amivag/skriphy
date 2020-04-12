import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";

import { GIFGallery } from "./components/GIFGallery";
import { SearchBox } from "./components/SearchBox";

import * as giphy from "./libs/giphy.js";
import * as clientStore from "./libs/clientStore";

import "./styles/SkriphyApp.css";

const API_STATUS = {
  LOADING: "loading",
  IDLE: "idle",
  SUCCESS: "success",
  ERROR: "error",
};

//let myGIPHYAPIKey = "xIuBoWebXJkrn7kaq9jWPrZk6u6prPPy";

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
  const [errorMessage, setErrorMessage] = useState("");
  const [giphyAPIKey, setGiphyAPIKey] = useState("");

  const resetApp = () => {
    clientStore.resetLocalDataExceptAPIKey();
    setSearchInputValue("");
    setApiResults([]);
    setApiResultsHiddenIds([]);
    setAPILoadingStatus(API_STATUS.IDLE);
  };

  useEffect(() => {
    const {
      localGiphyAPIKey,
      localImageObjects,
      localHiddenImageIds,
      localSearchTerm,
    } = clientStore.getDataFromLocal();

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
    if (localGiphyAPIKey) {
      setGiphyAPIKey(localGiphyAPIKey);
    }

    document.title =
      "skriphy | ReactJS demo by Vangelis Erotokritakis (04/2020)";
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      setAPILoadingStatus(API_STATUS.LOADING);
      setApiResultsHiddenIds([]);

      const artificialDelayMilliseconds = 1200; // for simulating slower network
      setTimeout(function () {
        // https://developers.giphy.com/docs/api/endpoint/#search
        const searchURL = giphy.getSearchURL(giphyAPIKey, searchTerm);
        const searchResult = axios(searchURL);
        searchResult
          .then((response) => {
            const imagesData = giphy.extractImagesObjectFromAPISearch(response);
            if (!imagesData) {
              // error in received data
            }
            clientStore.saveNewSearchDataToLocal({
              searchTerm,
              imageObjects: imagesData,
            });
            setAPILoadingStatus(API_STATUS.SUCCESS);
            setApiResults(imagesData);
          })
          .catch((errorMsg) => {
            setAPILoadingStatus(API_STATUS.ERROR);
            setErrorMessage(errorMsg);
            //window.alert(errorMsg);
          });
      }, artificialDelayMilliseconds);
    }
    // Line below is to stop complaining about missing dependencies...
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              <span className="loader">Searching...</span>
            </div>
          )}
          {apiLoadingStatus === API_STATUS.ERROR && (
            <div className="state-error">
              <div>
                Oops... there was an error with your request, maybe try again?
              </div>
              <div>{errorMessage}</div>
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
                  clientStore.saveHiddenImageIds(updatedHiddenIds);
                }}
              />
            </div>
          )}
        </section>
      </main>
      <footer>
        <div>GIPHY search by Vangelis Erotokritakis (April 2020)</div>
        <div>
          <button type="button" className="btn reset-app" onClick={resetApp}>
            Reset Everything!
          </button>
          <label>
            GIPHY API Key:{" "}
            <input
              className="apikey-input"
              type="text"
              name="apiKeyInput"
              placeholder="Insert your key..."
              value={giphyAPIKey}
              onChange={(e) => {
                const val = e.target.value;
                clientStore.saveAPIKey(val);
                setGiphyAPIKey(val);
              }}
            />
          </label>
        </div>
      </footer>
    </div>
  );
}

export default SkriphyApp;
