import React from "react";

function extractGiphyItemProperties(giphyApiItem) {
  return {
    itemId: giphyApiItem?.id,
    urlGIFPreview: giphyApiItem?.images?.preview_gif?.url,
  };
}

export function GIFGallery({
  giphyGalleryItems,
  hiddenItemIds,
  removeItemById,
}) {
  if (!giphyGalleryItems) return null;
  else
    return (
      <ul className="items-list">
        {giphyGalleryItems.map((giphyAPIItem) => {
          const { itemId, urlGIFPreview } = extractGiphyItemProperties(
            giphyAPIItem
          );

          const isItemIdHidden = hiddenItemIds.indexOf(itemId) >= 0;
          if (isItemIdHidden) return null;
          else
            return (
              <li className="item" key={itemId}>
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
        })}
      </ul>
    );
}

//export default GIFGallery;

/**
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
  console.log(`Copied to clipboard ${text}`);
}
