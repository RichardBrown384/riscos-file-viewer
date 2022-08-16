import React, { useState } from 'react';
import { Buffer } from 'buffer';
import { ErrorBoundary } from 'react-error-boundary';
import DrawComponent from './components/DrawComponent';
import FontOutlinesComponent from './components/FontOutlinesComponent';
import ViewerFallbackComponent from './components/ViewerFallbackComponent';
import ArtworksComponent from './components/ArtworksComponent';

function App() {
  const [array, setArray] = useState(null);
  async function loadFile(event) {
    const { target: { files = [] } } = event;
    const [file] = files;
    if (file) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        setArray(Uint8Array.from(buffer));
      } catch (e) {
        setArray(null);
      }
    } else {
      setArray(null);
    }
  }
  return (
    <div>
      <h1>RISC OS File Viewer</h1>
      <p>Can be used to view !Draw, Font Outline, and ArtWorks (experimental!) files.</p>
      <ErrorBoundary
        FallbackComponent={ViewerFallbackComponent}
        onReset={() => setArray(null)}
      >
        <input type="file" onChange={loadFile} />
        <DrawComponent array={array} />
        <FontOutlinesComponent array={array} />
        <ArtworksComponent array={array} />
      </ErrorBoundary>
    </div>
  );
}

export default App;
