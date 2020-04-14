import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";

import { SearchBox } from "./components/SearchBox";

import * as giphy from "./libs/giphy.js";
import * as clientStore from "./libs/clientStore";
import { API_STATUS, APP_THEME } from "./libs/appParams.js";

import {
  SectionStateIdle,
  SectionAPIKeyWarning,
  SectionAPIError,
  SectionAPILoading,
  SectionHeader,
  SectionFooter,
  SectionGallery,
} from "./components/UISections";

import "./styles/SkriphyApp.css";

function SkriphyApp() {
  const [appTheme, setAppTheme] = useState(APP_THEME.LIGHT);
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

  // On first component mount
  useEffect(() => {
    const {
      localGiphyAPIKey,
      localImageObjects,
      localHiddenImageIds,
      localSearchTerm,
      localAppTheme,
    } = clientStore.getDataFromLocal();

    if (localImageObjects) {
      setApiResults(localImageObjects);
      setAPILoadingStatus(API_STATUS.SUCCESS);
    }
    if (localSearchTerm) {
      setSearchInputValue(localSearchTerm);
      setSearchTerm(localSearchTerm);
    }
    if (localHiddenImageIds) {
      setApiResultsHiddenIds(localHiddenImageIds);
    }
    if (localGiphyAPIKey) {
      setGiphyAPIKey(localGiphyAPIKey);
    }
    if (localAppTheme) {
      setAppTheme(localAppTheme);
    }

    document.title =
      "skriphy | ReactJS demo by Vangelis Erotokritakis (04/2020)";
  }, []);

  // Start a new image search
  useEffect(() => {
    if (searchTerm.length > 0) {
      setAPILoadingStatus(API_STATUS.LOADING);
      window.scrollTo({ top: 0, behavior: "smooth" });

      const artificialDelayMilliseconds = 1200; // for simulating slower network
      setTimeout(function () {
        // https://developers.giphy.com/docs/api/endpoint/#search
        const searchURL = giphy.getSearchURL(giphyAPIKey, searchTerm);
        const searchResult = axios(searchURL);
        searchResult
          .then((response) => {
            handleNewImageDataFromAPI(response);
          })
          .catch((errorMsg) => {
            handleNewImageDataAPIError(errorMsg);
          });
      }, artificialDelayMilliseconds);
    }
    // Line below is to stop complaining about missing dependencies...
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchLastPerformedTimestamp]);

  const handleNewImageDataAPIError = (errorMsg) => {
    setAPILoadingStatus(API_STATUS.ERROR);
    setErrorMessage(errorMsg);
    //window.alert(errorMsg);
  };

  const handleNewImageDataFromAPI = (apiResponse) => {
    const imagesData = giphy.extractImagesObjectFromAPISearch(apiResponse);
    if (!imagesData) {
      // error in received data, not in the expected format
    }
    clientStore.saveNewSearchDataToLocal({
      searchTerm,
      imageObjects: imagesData,
    });
    setApiResultsHiddenIds([]);
    setAPILoadingStatus(API_STATUS.SUCCESS);
    setApiResults(imagesData);
  };

  const resetApp = () => {
    clientStore.resetLocalDataExceptAPIKey();
    setSearchInputValue("");
    setApiResults([]);
    setApiResultsHiddenIds([]);
    setAPILoadingStatus(API_STATUS.IDLE);
    setAppTheme(APP_THEME.LIGHT);
  };

  const removeItemById = (itemId) => {
    const updatedHiddenIds = [...apiResultsHiddenIds, itemId];
    const updatedHiddenIdsUniqueSet = new Set(updatedHiddenIds); // remove duplicates (Set)
    const updatedHiddenIdsUnique = [...updatedHiddenIdsUniqueSet]; // back in Array
    setApiResultsHiddenIds(updatedHiddenIdsUnique);
    clientStore.saveHiddenImageIds(updatedHiddenIdsUnique);
  };

  const toggleAppTheme = () => {
    if (appTheme === APP_THEME.LIGHT) {
      setAppTheme(APP_THEME.DARK);
      clientStore.saveAppTheme(APP_THEME.DARK);
    } else {
      setAppTheme(APP_THEME.LIGHT);
      clientStore.saveAppTheme(APP_THEME.LIGHT);
    }
  };

  const initiateGiphyAPISearchOnTerm = (term) => {
    setSearchTerm(term);
    setSearchLastPerformedTimestamp(Date.now());
  };

  const setAPIKey = (apiKey) => {
    clientStore.saveAPIKey(apiKey);
    setGiphyAPIKey(apiKey);
  };

  const isAPIKeyEntered = giphyAPIKey.length > 8; // something is entered, no check if key is correct!

  return (
    <div className={`SkriphyApp ${appTheme}`}>
      <SectionHeader {...{ resetApp, toggleAppTheme }} />
      <main>
        {isAPIKeyEntered && (
          <section className="giphy-search">
            <SearchBox
              {...{
                searchInputValue,
                setSearchInputValue,
                initiateGiphyAPISearchOnTerm,
              }}
            />
          </section>
        )}
        {!isAPIKeyEntered && <SectionAPIKeyWarning />}
        {isAPIKeyEntered && (
          <Fragment>
            <section className="search-results">
              {apiLoadingStatus === API_STATUS.IDLE && <SectionStateIdle />}
              {apiLoadingStatus === API_STATUS.LOADING && <SectionAPILoading />}
              {apiLoadingStatus === API_STATUS.ERROR && (
                <SectionAPIError errorMessage={errorMessage} />
              )}
              {apiLoadingStatus === API_STATUS.SUCCESS && (
                <SectionGallery
                  {...{
                    searchTerm,
                    apiResults,
                    apiResultsHiddenIds,
                    removeItemById,
                  }}
                />
              )}
            </section>
          </Fragment>
        )}
      </main>
      <SectionFooter
        {...{ giphyAPIKey, setAPIKey, resetApp, toggleAppTheme }}
      />
    </div>
  );
}

export default SkriphyApp;
