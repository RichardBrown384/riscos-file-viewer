import React from 'react';
import PropTypes from 'prop-types';

function ViewerFallbackComponent({ error: { message }, resetErrorBoundary }) {
  return (
    <div>
      <p>An error occurred:</p>
      <pre>{message}</pre>
      <button type="button" onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

ViewerFallbackComponent.propTypes = {
  error: PropTypes.instanceOf(Error).isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
};

export default ViewerFallbackComponent;
