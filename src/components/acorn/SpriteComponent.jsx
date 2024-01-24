import React from 'react';
import { Sprite, SpriteArea } from 'riscos-file-formats';
import PropTypes from 'prop-types';

const NINETY_DOTS_PER_INCH = 90;

function convertSpritesToPngs(array) {
  const pngs = [];
  const { sprites = [] } = SpriteArea.fromUint8Array(array);
  for (let i = 0; i < sprites.length; i += 1) {
    const sprite = sprites[i];
    pngs.push(Sprite.Png.fromSprite(sprite));
  }
  return pngs;
}

function mapPngs(pngs) {
  const images = [];
  for (let i = 0; i < pngs.length; i += 1) {
    const {
      png, width, height, xDpi, yDpi,
    } = pngs[i];
    const blob = new Blob([png.buffer]);
    const objectURL = URL.createObjectURL(blob);
    const scaledWidth = width * (NINETY_DOTS_PER_INCH / xDpi);
    const scaledHeight = height * (NINETY_DOTS_PER_INCH / yDpi);
    images.push(
      <div key={i}>
        <img
          width={scaledWidth}
          height={scaledHeight}
          alt={`sprite-${i}`}
          src={objectURL}
        />
      </div>,
    );
  }
  return images;
}

function SpriteComponent({ array }) {
  if (!(array && SpriteArea.isHeaderPresent(array))) {
    return null;
  }
  return (
    <div>
      {mapPngs(convertSpritesToPngs(array))}
    </div>
  );
}

SpriteComponent.propTypes = {
  // eslint-disable-next-line react/require-default-props
  array: PropTypes.instanceOf(Uint8Array),
};

export default SpriteComponent;
