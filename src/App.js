import {useState} from 'react';
import mapDrawFile from './mapper/mapper';
import DrawComponent from './components/DrawComponent';

function App() {
    const [drawFile, setDrawFile] = useState(null);
    async function loadFile(event) {
        const { target: { files = [] }} = event;
        const [file,] = files;
        if (file) {
            try {
                const buffer = Buffer.from(await file.arrayBuffer());
                setDrawFile(mapDrawFile(buffer));
            } catch (e) {
                setDrawFile(null);
            }
        } else {
            setDrawFile(null);
        }
    }
    return (
        <div>
            <h1>RISC OS Draw Viewer</h1>
            <input type="file" onChange={loadFile} />
            <DrawComponent drawFile={drawFile} />
        </div>
    );
}

export default App;
