// Handle the data storage on the client side (i.e. localStorage)

const STORAGE_KEY = {
  GIPHY_API_KEY: "giphyAPIKey",
  IMAGE_OBJECTS: "imageObjects",
  HIDDEN_IMAGE_IDS: "hiddenImageIds",
  SEARCH_TERM: "searchTerm",
  APP_THEME: "appTheme",
};

export function getDataFromLocal() {
  const localGiphyAPIKey =
    localStorage.getItem(STORAGE_KEY.GIPHY_API_KEY) ?? "";
  const localImageObjectsStringified = localStorage.getItem(
    STORAGE_KEY.IMAGE_OBJECTS
  );
  const localImageObjects = localImageObjectsStringified
    ? JSON.parse(localImageObjectsStringified)
    : [];
  const localHiddenImageIdsStringified = localStorage.getItem(
    STORAGE_KEY.HIDDEN_IMAGE_IDS
  );
  const localHiddenImageIds = localHiddenImageIdsStringified
    ? JSON.parse(localHiddenImageIdsStringified)
    : [];
  const localSearchTerm = localStorage.getItem(STORAGE_KEY.SEARCH_TERM) ?? "";

  const localAppTheme = localStorage.getItem(STORAGE_KEY.APP_THEME) ?? "";

  return {
    localGiphyAPIKey,
    localImageObjects,
    localHiddenImageIds,
    localSearchTerm,
    localAppTheme
  };
}

export function saveNewSearchDataToLocal({ searchTerm, imageObjects }) {
  localStorage.setItem(STORAGE_KEY.IMAGE_OBJECTS, JSON.stringify(imageObjects));
  localStorage.setItem(STORAGE_KEY.SEARCH_TERM, searchTerm);
  localStorage.setItem(STORAGE_KEY.HIDDEN_IMAGE_IDS, ""); // it's a new search, remove previous hidden image data
}

export function saveHiddenImageIds(updatedHiddenImageIds) {
  localStorage.setItem(
    STORAGE_KEY.HIDDEN_IMAGE_IDS,
    JSON.stringify(updatedHiddenImageIds)
  );
}

export function saveAPIKey(APIKey) {
  localStorage.setItem(STORAGE_KEY.GIPHY_API_KEY, APIKey);
}

export function saveAppTheme(appTheme) {
  localStorage.setItem(STORAGE_KEY.APP_THEME, appTheme);
}

export function resetLocalDataExceptAPIKey() {
  localStorage.setItem(STORAGE_KEY.IMAGE_OBJECTS, "");
  localStorage.setItem(STORAGE_KEY.SEARCH_TERM, "");
  localStorage.setItem(STORAGE_KEY.HIDDEN_IMAGE_IDS, "");
}
