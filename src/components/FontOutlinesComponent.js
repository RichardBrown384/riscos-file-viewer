import React from 'react';
import { FontOutlines } from 'riscos-file-formats';
import PropTypes from 'prop-types';
import SVGComponent from './SVGComponent';

function FontOutlinesComponent({ array }) {
  if (!(array && FontOutlines.isHeaderPresent(array))) {
    return null;
  }
  const outlines = FontOutlines.fromUint8Array(array);
  const element = FontOutlines.SVGElement.fromOutlines(outlines);
  return (
    <div>
      <SVGComponent element={element} />
    </div>
  );
}

FontOutlinesComponent.propTypes = {
  // eslint-disable-next-line react/require-default-props
  array: PropTypes.instanceOf(Uint8Array),
};

export default FontOutlinesComponent;
