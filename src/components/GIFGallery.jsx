import React from "react";
import PropTypes from "prop-types";

import { copyTextToClipboard } from "../libs/clipboard.js";
import { extractPropertiesFromAPIImageObject } from "../libs/giphy.js";

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
          const {
            itemId,
            url,
            urlGIFOriginal,
            urlGIFPreview,
            urlGIFFixedHeight,
            urlGIFFixedWidth,
          } = extractPropertiesFromAPIImageObject(giphyImageObject);

          const isItemIdHidden = hiddenItemIds.indexOf(itemId) >= 0;

          if (!isItemIdHidden) {
            return (
              <GIFImageItem
                key={itemId}
                {...{
                  itemId,
                  url,
                  urlGIFOriginal,
                  urlGIFPreview,
                  urlGIFFixedHeight,
                  urlGIFFixedWidth,
                  removeItemById,
                }}
              />
            );
          }
        })}
      </ul>
    );
};
GIFGallery.propTypes = {
  giphyGalleryItems: PropTypes.array,
  hiddenItemIds: PropTypes.array,
  removeItemById: PropTypes.func,
};

const GIFImageItem = ({
  itemId,
  url,
  urlGIFOriginal,
  urlGIFPreview,
  urlGIFFixedHeight,
  urlGIFFixedWidth,
  removeItemById,
}) => {
  return (
    <li className="image-item">
      <img className="img" src={urlGIFFixedWidth} alt={urlGIFFixedWidth} />
      <div className="controls">
        <button
          title="Copy link to clipboard"
          type="button"
          className="btn copy-link"
          onClick={() => {
            copyTextToClipboard(url);
          }}
        >
          C
        </button>
        <button
          title="Remove image"
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
GIFImageItem.propTypes = {
  itemId: PropTypes.string,
  urlGIFPreview: PropTypes.string,
  removeItemById: PropTypes.func,
};
