import {Sprite} from 'riscos-sprite';

import {
    CAP_BUTT,
    CAP_ROUND,
    CAP_SQUARE,
    CAP_TRIANGLE,
    Draw,
    JOIN_BEVEL,
    JOIN_MITRE,
    JOIN_ROUND,
    TAG_BEZIER,
    TAG_CLOSE_SUB_PATH,
    TAG_DRAW,
    TAG_END,
    TAG_MOVE,
    TYPE_PATH,
    TYPE_SPRITE,
    WINDING_EVEN_ODD
} from 'riscos-draw';
import mapSprite from "./sprite";
import mapRgbaImage from "./rgba-image";
import {Base64} from "js-base64";

const MIN_STROKE_WIDTH = 160;

const TAG_MAP = {
    [TAG_END]: '',
    [TAG_MOVE]: 'M',
    [TAG_CLOSE_SUB_PATH]: 'Z',
    [TAG_BEZIER]: 'C',
    [TAG_DRAW]: 'L'
};

const JOIN_MAP = {
    [JOIN_MITRE]: 'mitre',
    [JOIN_ROUND]: 'round',
    [JOIN_BEVEL]: 'bevel'
};

const CAP_MAP = {
    [CAP_BUTT]: 'butt',
    [CAP_ROUND]: 'round',
    [CAP_SQUARE]: 'square',
    [CAP_TRIANGLE]: 'triangle'
};

function mapPathData(elements) {
    const path = [];
    for (const {tag, points = []} of elements) {
        path.push(TAG_MAP[tag]);
        path.push(points.flatMap(({x, y}) => [x, y]).join(' '));
    }
    return path.join(' ');
}

function mapColour(colour) {
    if (colour === 0xFFFFFFFF) {
        return 'none';
    }
    const elements = [
        (colour >> 8) & 0xFF,
        (colour >> 16) & 0xFF,
        (colour >> 24) & 0xFF,
    ];
    return `rgb(${elements})`;
}

function mapPathObject(pathObject) {
    const {
        fillColour,
        outlineColour,
        outlineWidth,
        pathStyle: {
            join,
            capStart,
            windingRule,
            dash
        },
        path
    } = pathObject;
    const {
        offset: strokeDashoffset,
        array: strokeDasharray
    } = dash || {};
    return {
        tag: 'path',
        d: mapPathData(path),
        fill: mapColour(fillColour),
        stroke: mapColour(outlineColour),
        strokeWidth: Math.max(MIN_STROKE_WIDTH, outlineWidth),
        ...(join !== JOIN_MITRE && {strokeLinejoin: JOIN_MAP[join]}),
        ...(capStart in [CAP_SQUARE, CAP_ROUND] && {strokeLinecap: CAP_MAP[capStart]}),
        ...(windingRule === WINDING_EVEN_ODD && {fillRule: 'evenodd'}),
        ...(strokeDashoffset && {strokeDashoffset}),
        ...(strokeDasharray && {strokeDasharray})
    };
}

function mapSpriteObject(boundingBox, spriteObject, array) {
    const {minX, maxX, minY, maxY} = boundingBox;
    const {
        start,
        end
    } = spriteObject;
    const slice = array.slice(start, end)
    const sprite = Sprite.fromUint8Array(slice);
    const rgbaImage = mapSprite(sprite);
    const png = mapRgbaImage(rgbaImage);
    const data = Base64.fromUint8Array(png);
    return {
        tag: 'image',
        x: minX,
        y: -maxY,
        width: (maxX - minX),
        height: (maxY - minY),
        preserveAspectRatio: 'none',
        xlinkHref: `data:image/png;base64,${data}`,
        transform: 'scale(1,-1)'
    }
}

function mapDrawFile(array) {

    const {
        header: {
            boundingBox: fileBoundingBox
        },
        objects
    } = Draw.fromUint8Array(array);

    function mergeBoundingBox(other) {
        if (!other) {
            return;
        }

        const {minX, maxX, minY, maxY} = other;

        if ((minX > maxX) || (minY > maxY)) {
            return;
        }

        fileBoundingBox.minX = Math.min(fileBoundingBox.minX, minX);
        fileBoundingBox.maxX = Math.max(fileBoundingBox.maxX, maxX);
        fileBoundingBox.minY = Math.min(fileBoundingBox.minY, minY);
        fileBoundingBox.maxY = Math.max(fileBoundingBox.maxY, maxY);
    }

    const mappedObjects = [];
    for (const {type, boundingBox, ...data} of objects) {
        mergeBoundingBox(boundingBox);
        switch (type) {
            case TYPE_PATH: {
                mappedObjects.push(mapPathObject(data));
                break;
            }
            case TYPE_SPRITE: {
                mappedObjects.push(mapSpriteObject(boundingBox, data, array));
                break;
            }
            default:
                break;
        }
    }

    return {
        boundingBox: fileBoundingBox,
        objects: mappedObjects
    };
}

export default mapDrawFile;
