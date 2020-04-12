// Handle the data storage on the client

const STORAGE_KEY = {
  GIPHY_API_KEY: "giphyAPIKey",
  IMAGE_OBJECTS: "imageObjects",
  HIDDEN_IMAGE_IDS: "hiddenImageIds",
  SEARCH_TERM: "searchTerm",
};

export function getDataFromLocal() {
  const localGiphyAPIKey = localStorage.getItem(STORAGE_KEY.GIPHY_API_KEY);
  const localImageObjects = localStorage.getItem(STORAGE_KEY.IMAGE_OBJECTS);
  const localHiddenImageIds = localStorage.getItem(
    STORAGE_KEY.HIDDEN_IMAGE_IDS
  );
  const localSearchTerm = localStorage.getItem(STORAGE_KEY.SEARCH_TERM);
  return {
    localGiphyAPIKey,
    localImageObjects,
    localHiddenImageIds,
    localSearchTerm,
  };
}

export function saveNewSearchDataToLocal({ searchTerm, imageObjects }) {
  localStorage.setItem(STORAGE_KEY.IMAGE_OBJECTS, JSON.stringify(imageObjects));
  localStorage.setItem(STORAGE_KEY.SEARCH_TERM, searchTerm);
  localStorage.setItem(STORAGE_KEY.HIDDEN_IMAGE_IDS, ""); // it's a new search, remove previous hidden data
}

export function saveHiddenImageIds(updatedHiddenImageIds) {
  localStorage.setItem(
    STORAGE_KEY.HIDDEN_IMAGE_IDS,
    JSON.stringify(updatedHiddenImageIds)
  );
}

export function resetLocalDataExceptAPIKey() {
  localStorage.setItem(STORAGE_KEY.IMAGE_OBJECTS, "");
  localStorage.setItem(STORAGE_KEY.SEARCH_TERM, "");
  localStorage.setItem(STORAGE_KEY.HIDDEN_IMAGE_IDS, "");
}
