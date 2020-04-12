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
          const { itemId, urlGIFPreview } = extractPropertiesFromAPIImageObject(
            giphyImageObject
          );

          const isItemIdHidden = hiddenItemIds.indexOf(itemId) >= 0;

          if (!isItemIdHidden) {
            return (
              <GIFImageItem
                key={itemId}
                {...{ itemId, urlGIFPreview, removeItemById }}
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

const GIFImageItem = ({ itemId, urlGIFPreview, removeItemById }) => {
  return (
    <li className="image-item">
      <img className="img" src={urlGIFPreview} alt={urlGIFPreview} />
      <div className="controls">
        <button
          type="button"
          className="btn copy-link"
          onClick={() => {
            copyTextToClipboard(urlGIFPreview);
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
GIFImageItem.propTypes = {
  itemId: PropTypes.string,
  urlGIFPreview: PropTypes.string,
  removeItemById: PropTypes.func,
};
