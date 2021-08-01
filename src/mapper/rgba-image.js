import CRC32 from 'crc-32';
import pako from 'pako';

const FILE_HEADER = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

const FILE_HEADER_SIZE = 8;
const LENGTH_SIZE = 4;
const TYPE_SIZE = 4;
const CRC32_SIZE = 4;

const CONTROL_STRUCTURE_SIZE = LENGTH_SIZE + TYPE_SIZE + CRC32_SIZE;

const IHDR_LENGTH = 13;
const IEND_LENGTH = 0;

const FILTER_TYPE_NONE = 0;

const COLOR_TYPE_RGBA = 6;

function createPngImage(q) {

    const {
        width,
        height,
        imageData,
        bitDepth,
        colorType,
        compressionMethod = 0,
        filterMethod = 0,
        interlaceMethod = 0
    } = q;

    const idatLength = imageData.length;
    const size =
        FILE_HEADER_SIZE +
        (CONTROL_STRUCTURE_SIZE + IHDR_LENGTH) +
        (CONTROL_STRUCTURE_SIZE + idatLength) +
        (CONTROL_STRUCTURE_SIZE + IEND_LENGTH);

    const pngArray = new Uint8Array(size);
    const pngView = new DataView(pngArray.buffer);
    let offset = 0;

    function set(data) {
        pngArray.set(data, offset);
        offset += data.length;
        return offset;
    }

    function setUint32(value) {
        pngView.setUint32(offset, value);
        offset += 4;
        return offset;
    }

    function setInt32(value) {
        pngView.setInt32(offset, value);
        offset += 4;
        return offset;
    }

    function createCrcFrom(start) {
        return CRC32.buf(pngArray.slice(start, offset));
    }

    function createBytes(type) {
        return [...type].map(char => char.charCodeAt(0));
    }

    set(FILE_HEADER);

    const ihdrStart = setUint32(IHDR_LENGTH);
    set(createBytes('IHDR'));
    setUint32(width);
    setUint32(height);
    set([
        bitDepth,
        colorType,
        compressionMethod,
        filterMethod,
        interlaceMethod
    ]);
    setInt32(createCrcFrom(ihdrStart));

    const idatStart = setUint32(idatLength);
    set(createBytes('IDAT'));
    set(imageData);
    setInt32(createCrcFrom(idatStart));

    const iendStart = setUint32(IEND_LENGTH);
    set(createBytes('IEND'));
    setInt32(createCrcFrom(iendStart));

    return pngArray;
}

function filterImage({width, height, pixels}) {

    const filteredSize = height * (1 + 4 * width);

    const filteredArray = new Uint8Array(filteredSize);
    const filteredView = new DataView(filteredArray.buffer);
    let destOffset = 0;

    function setUint8(value) {
        filteredView.setUint8(destOffset++, value);
    }

    for (let y = 0, srcOffset = 0; y < height; y++) {
        setUint8(FILTER_TYPE_NONE);
        for (let x = 0; x < width; x++) {
            setUint8(pixels[srcOffset++]);
            setUint8(pixels[srcOffset++]);
            setUint8(pixels[srcOffset++]);
            setUint8(pixels[srcOffset++]);
        }
    }

    return filteredArray;
}

function mapRgbaImage({width, height, pixels}) {
    const filtered = filterImage({width, height, pixels});
    return createPngImage({
        width,
        height,
        imageData: pako.deflate(filtered),
        bitDepth: 8,
        colorType: COLOR_TYPE_RGBA
    });
}

export default mapRgbaImage;