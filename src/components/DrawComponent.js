import React from 'react';
import { Draw } from 'riscos-file-formats';
import PropTypes from 'prop-types';
import SVGComponent from './SVGComponent';

function DrawComponent({ array }) {
  if (!(array && Draw.isHeaderPresent(array))) {
    return null;
  }
  const draw = Draw.fromUint8Array(array);
  const element = Draw.SVGElement.fromDraw(draw, array);
  return (
    <div>
      <SVGComponent element={element} />
    </div>
  );
}

DrawComponent.propTypes = {
  // eslint-disable-next-line react/require-default-props
  array: PropTypes.instanceOf(Uint8Array),
};

export default DrawComponent;
