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
