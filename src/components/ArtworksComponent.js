import React from 'react';
import { Artworks } from 'riscos-artworks';
import PropTypes from 'prop-types';
import { JSONTree } from 'react-json-tree';
import SVGComponent from './SVGComponent';
import ArtworksD3TreeComponent from './ArtworksTreeComponent';

function DrawComponent({ array }) {
  if (!(array && Artworks.isHeaderPresent(array))) {
    return null;
  }
  const artworks = Artworks.fromUint8Array(array);
  const outline = Artworks.SVGElement.Outline.fromArtworks(artworks);
  const normal = Artworks.SVGElement.Normal.fromArtworks(artworks);
  return (
    <div>
      <SVGComponent element={outline} />
      <SVGComponent element={normal} />
      <JSONTree data={artworks} />
      <ArtworksD3TreeComponent data={artworks.records} />
    </div>
  );
}

DrawComponent.propTypes = {
  // eslint-disable-next-line react/require-default-props
  array: PropTypes.instanceOf(Uint8Array),
};

export default DrawComponent;