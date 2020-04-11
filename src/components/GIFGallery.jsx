import React from "react";

/**
 * Extract useful properties from a GIF image object (GIPHY API).
 * // https://developers.giphy.com/docs/api/schema
 * @param {*} giphyImageObject
 */
function extractGiphyItemProperties(giphyImageObject) {
  return {
    itemId: giphyImageObject?.id,
    urlGIFPreview: giphyImageObject?.images?.preview_gif?.url,
  };
}

export const GIFGallery = ({
  giphyGalleryItems,
  hiddenItemIds,
  removeItemById,
}) => {
  if (!giphyGalleryItems) return null;
  else
    return (
      <ul className="items-list">
        {giphyGalleryItems.map((giphyImageObject) => {
          const { itemId, urlGIFPreview } = extractGiphyItemProperties(
            giphyImageObject
          );

          const isItemIdHidden = hiddenItemIds.indexOf(itemId) >= 0;

          if (!isItemIdHidden) {
            return (
              <GIFImageItem {...{ itemId, urlGIFPreview, removeItemById }} />
            );
          }
        })}
      </ul>
    );
};

const GIFImageItem = ({ itemId, urlGIFPreview, removeItemById }) => {
  return (
    <li className="image-item" key={itemId}>
      <img className="img" src={urlGIFPreview} alt={urlGIFPreview} />
      <div className="controls">
        <button
          type="button"
          className="btn copy-link"
          onClick={() => {
            copyToClipboard(urlGIFPreview);
          }}
        >
          Copy Link
        </button>
        <button
          type="button"
          className="btn remove"
          onClick={() => {
            removeItemById(itemId);
          }}
        >
          &times;
        </button>
      </div>
    </li>
  );
};

/**
 * Utility function from...
 * https://stackoverflow.com/questions/33855641/copy-output-of-a-javascript-variable-to-the-clipboard
 * @param {*} text
 */
function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  // to avoid breaking orgain page when copying more words
  // cant copy when adding below this code
  // dummy.style.display = 'none'
  document.body.appendChild(dummy);
  //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
  //console.log(`Copied to clipboard ${text}`);
}
