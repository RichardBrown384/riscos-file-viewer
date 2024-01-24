import React from 'react';
import { Artworks } from 'riscos-artworks';
import PropTypes from 'prop-types';
import { JSONTree } from 'react-json-tree';
import SVGComponent from '../common/SVGComponent';
import ArtworksD3TreeComponent from './ArtWorksTreeComponent';

function ArtWorksComponent({ array, debug }) {
  if (!(array && Artworks.isHeaderPresent(array))) {
    return null;
  }
  const artworks = Artworks.fromUint8Array(array);
  const normal = Artworks.SVGElement.Normal.fromArtworks(artworks);
  const outline = Artworks.SVGElement.Outline.fromArtworks(artworks);
  const denormalised = Artworks.denormalise(artworks);
  return (
    <div>
      <SVGComponent element={normal} />
      {debug && <SVGComponent element={outline} />}
      {debug && <JSONTree data={artworks} />}
      {debug && <ArtworksD3TreeComponent data={artworks.records} />}
      {debug && <ArtworksD3TreeComponent data={denormalised.records} />}
    </div>
  );
}

ArtWorksComponent.propTypes = {
  // eslint-disable-next-line react/require-default-props
  array: PropTypes.instanceOf(Uint8Array),
  debug: PropTypes.bool,
};

ArtWorksComponent.defaultProps = {
  debug: false,
};

export default ArtWorksComponent;
