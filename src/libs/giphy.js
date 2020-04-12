/**
 * Handles the GIPHY API, by translating the response to Javascript data.
 */

import PropTypes from "prop-types";
/**
 * Extract useful properties from a GIF image object (GIPHY API).
 * // https://developers.giphy.com/docs/api/schema
 * @param {*} giphyImageObject
 */
export function extractPropertiesFromAPIImageObject(giphyImageObject) {
  return {
    itemId: giphyImageObject?.id,
    urlGIFPreview: giphyImageObject?.images?.preview_gif?.url,
  };
}

export function extractImagesObjectFromAPISearch(searchAPIData) {
  const imagesData = searchAPIData?.data?.data;
  return imagesData;
}

export function getSearchURL(apiKey, searchTerm) {
  const searchURL = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchTerm}`;
  return searchURL;
}
getSearchURL.propTypes = {
  apiKey: PropTypes.string,
  searchTerm: PropTypes.string,
};
