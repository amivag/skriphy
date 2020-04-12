import React from "react";

import { GIFGallery } from "./GIFGallery";
import { IconSVGLoader } from "./Icons";

export const SectionStateIdle = () => (
  <div className="state-idle">
    <span>Search for something...</span>
  </div>
);

export const SectionAPIKeyWarning = () => (
  <section className="notice warning">
    Please fill in your GIPHY API key!
  </section>
);

export const SectionAPIError = (errorMessage) => (
  <div className="state-error">
    <div>Oops... there was an error with your request, maybe try again?</div>
    <div>{errorMessage}</div>
  </div>
);

export const SectionAPILoading = () => (
  <div className="state-loading">
    <div className="loader">Searching...</div>
    <div>
      <IconSVGLoader />
    </div>
  </div>
);

export const SectionHeader = () => (
  <header>
    <h1 className="title">skriphy</h1>
  </header>
);

export const SectionFooter = ({
  giphyAPIKey,
  setAPIKey,
  resetApp,
  toggleAppTheme,
}) => (
  <footer>
    <label className="api-key-label">
      <span>GIPHY API Key: </span>
      <input
        className="apikey-input"
        type="text"
        name="apiKeyInput"
        placeholder="Insert your key..."
        value={giphyAPIKey}
        onChange={(e) => {
          setAPIKey(e.target.value);
        }}
      />
    </label>
    <div className="actions">
      <button
        type="button"
        className="btn reset-app"
        title="Reset all app data (except your API key)"
        onClick={resetApp}
      >
        Reset Everything!
      </button>
      <button
        type="button"
        className="btn reset-app"
        title="Toggle theme"
        onClick={toggleAppTheme}
      >
        Switch Theme
      </button>
    </div>
    <div className="info">
      GIPHY search by Vangelis Erotokritakis (April 2020)
    </div>
  </footer>
);

export const SectionGallery = ({
  searchTerm,
  visibleSearchResultsCount,
  apiResults,
  apiResultsHiddenIds,
  removeItemById,
}) => (
  <div className="state-success">
    {searchTerm.length > 0 && (
      <h2 className="title">
        Results for '{searchTerm}' ({visibleSearchResultsCount})
      </h2>
    )}
    <GIFGallery
      giphyGalleryItems={apiResults}
      hiddenItemIds={apiResultsHiddenIds}
      removeItemById={removeItemById}
    />
  </div>
);
