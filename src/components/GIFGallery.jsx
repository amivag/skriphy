import React from "react";
import PropTypes from "prop-types";

import { copyTextToClipboard } from "../libs/clipboard.js";
import { extractPropertiesFromAPIImageObject } from "../libs/giphy.js";
import { IconSVGLink, IconSVGClear } from "./Icons";
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
          const { itemId } = extractPropertiesFromAPIImageObject(
            giphyImageObject
          );

          const isItemIdHidden = hiddenItemIds.indexOf(itemId) >= 0;
          if (isItemIdHidden) {
            return null;
          } else
            return (
              <GIFImageItem
                key={itemId}
                {...{
                  giphyImageObject,
                  removeItemById,
                }}
              />
            );
        })}
      </ul>
    );
};
GIFGallery.propTypes = {
  giphyGalleryItems: PropTypes.array,
  hiddenItemIds: PropTypes.array,
  removeItemById: PropTypes.func,
};

const GIFImageItem = ({ giphyImageObject, removeItemById }) => {
  const {
    itemId,
    url,
    urlGIFFixedWidth,
    urlGIFFixedWidth_Height,
  } = extractPropertiesFromAPIImageObject(giphyImageObject);
  return (
    <li className="image-item" key={itemId}>
      <img
        style={{ opacity: 0 }}
        className="img"
        id={itemId}
        src={urlGIFFixedWidth}
        alt={urlGIFFixedWidth}
        height={urlGIFFixedWidth_Height}
        loading="lazy"
        onLoad={() => {
          fadeInImg(itemId);
        }}
      />
      <div className="controls">
        <button
          title="Copy link to clipboard"
          type="button"
          className="btn copy-link"
          onClick={() => {
            copyTextToClipboard(url);
          }}
        >
          <IconSVGLink />
        </button>
        <button
          title="Remove image"
          type="button"
          className="btn remove"
          onClick={() => {
            removeItemById(itemId);
          }}
        >
          <IconSVGClear />
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

function fadeInImg(id) {
  document.getElementById(id).style.transition = "opacity 1s";
  document.getElementById(id).style.opacity = "1";
}
