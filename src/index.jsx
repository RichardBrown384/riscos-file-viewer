import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// For Safari:
// https://gist.github.com/hanayashiki/8dac237671343e7f0b15de617b0051bd
(function patchFileAndBlob() {
  function myArrayBuffer() {
    // this: File or Blob
    return new Promise((resolve) => {
      const fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.readAsArrayBuffer(this);
    });
  }

  File.prototype.arrayBuffer = File.prototype.arrayBuffer || myArrayBuffer;
  Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer || myArrayBuffer;
}());

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
