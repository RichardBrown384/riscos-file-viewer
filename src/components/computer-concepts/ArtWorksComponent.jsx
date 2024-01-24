import React from 'react';
import { Artworks } from 'riscos-artworks';
import PropTypes from 'prop-types';
import { JSONTree } from 'react-json-tree';
import SVGComponent from '../common/SVGComponent';
import ArtworksD3TreeComponent from './ArtWorksTreeComponent';

function ArtWorksComponent({ array }) {
  if (!(array && Artworks.isHeaderPresent(array))) {
    return null;
  }
  const artworks = Artworks.fromUint8Array(array);
  const outline = Artworks.SVGElement.Outline.fromArtworks(artworks);
  const normal = Artworks.SVGElement.Normal.fromArtworks(artworks);
  const denormalised = Artworks.denormalise(artworks);
  return (
    <div>
      <SVGComponent element={outline} />
      <SVGComponent element={normal} />
      <JSONTree data={artworks} />
      <ArtworksD3TreeComponent data={artworks.records} />
      <ArtworksD3TreeComponent data={denormalised.records} />
    </div>
  );
}

ArtWorksComponent.propTypes = {
  // eslint-disable-next-line react/require-default-props
  array: PropTypes.instanceOf(Uint8Array),
};

export default ArtWorksComponent;
