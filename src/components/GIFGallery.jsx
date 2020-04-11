import React from "react";

export function GIFGallery({
  giphyGalleryItems,
  hiddenItemIds,
  removeItemById,
}) {
  if (!giphyGalleryItems) return null;
  else
    return (
      <div>
        <ul className="items-list">
          {giphyGalleryItems.map((item) => {
            const itemId = item?.id;
            const urlGifPreview = item?.images?.preview_gif?.url;

            const isItemIdHidden = hiddenItemIds.indexOf(itemId) >= 0;
            if (isItemIdHidden) return null;
            else
              return (
                <li className="item" key={itemId}>
                  <img
                    className="img"
                    src={urlGifPreview}
                    alt={urlGifPreview}
                  />
                  <div className="controls">
                    <button
                      type="button"
                      className="btn copy-link"
                      onClick={() => {
                        //copyToClipboard(urlGifPreview);
                        //console.log(`Copied to urlGifPreview`);
                      }}
                    >
                      Copy Link
                    </button>
                    <button
                      type="button"
                      className="btn remove"
                      onClick={() => {
                        //setApiResultsHiddenIds([...apiResultsHiddenIds, itemId]);
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
      </div>
    );
}

//export default GIFGallery;
