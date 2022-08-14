import React, { useState } from 'react';
import { Buffer } from 'buffer';
import DrawComponent from './components/DrawComponent';

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
      <h1>RISC OS Draw Viewer</h1>
      <input type="file" onChange={loadFile} />
      <DrawComponent array={array} />
    </div>
  );
}

export default App;
