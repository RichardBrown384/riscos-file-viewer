/* eslint-disable no-bitwise */

import { Artworks } from 'riscos-artworks';

const { Constants } = Artworks;

const FILL_TYPE_NAMES = {
  [Constants.FILL_FLAT]: 'flat',
  [Constants.FILL_LINEAR]: 'linear',
  [Constants.FILL_RADIAL]: 'radial',
};

const JOIN_TYPE_NAMES = {
  [Constants.JOIN_MITRE]: 'mitre',
  [Constants.JOIN_ROUND]: 'round',
  [Constants.JOIN_BEVEL]: 'bevel',
};

const CAP_TYPE_NAMES = {
  [Constants.CAP_BUTT]: 'butt',
  [Constants.CAP_ROUND]: 'round',
  [Constants.CAP_SQUARE]: 'square',
  [Constants.CAP_TRIANGLE]: 'butt',
};

const WINDING_RULE_TYPE_NAMES = {
  [Constants.WINDING_RULE_NON_ZERO]: 'nonzero',
  [Constants.WINDING_RULE_EVEN_ODD]: 'evenodd',
};

function safeNameLookup(typeNames, value) {
  return typeNames[value & 0xFF] || 'unknown';
}

function formatName(prefix, suffix) {
  return `${prefix} (${suffix})`;
}

function nameLayer({ name = 'none' }) {
  return formatName('Layer', name);
}

function nameStrokeColour({ strokeColour = 'none' }) {
  return formatName('Stroke', strokeColour === 0xFFFFFFFF ? 'none' : strokeColour);
}

function nameStrokeWidth({ strokeWidth }) {
  return formatName('Stroke width', strokeWidth === 0xFFFFFFFF ? 'none' : strokeWidth);
}

function nameFillColour({ fillType }) {
  return formatName('Fill', safeNameLookup(FILL_TYPE_NAMES, fillType));
}

function nameJoinStyle({ joinStyle }) {
  return formatName('Join', safeNameLookup(JOIN_TYPE_NAMES, joinStyle));
}

function nameCapEndStyle({ capStyle }) {
  return formatName('Cap end', safeNameLookup(CAP_TYPE_NAMES, capStyle));
}

function nameCapStartStyle({ capStyle }) {
  return formatName('Cap start', safeNameLookup(CAP_TYPE_NAMES, capStyle));
}

function nameWindingRule({ windingRule }) {
  return formatName('Winding rule', safeNameLookup(WINDING_RULE_TYPE_NAMES, windingRule));
}

const NAME_FUNCTIONS_BY_TYPE = {
  [Constants.RECORD_01_TEXT]: () => 'Text',
  [Constants.RECORD_02_PATH]: () => 'Path',
  [Constants.RECORD_05_SPRITE]: () => 'Sprite',
  [Constants.RECORD_06_GROUP]: () => 'Group',
  [Constants.RECORD_0A_LAYER]: nameLayer,
  [Constants.RECORD_24_STROKE_COLOUR]: nameStrokeColour,
  [Constants.RECORD_25_STROKE_WIDTH]: nameStrokeWidth,
  [Constants.RECORD_26_FILL_COLOUR]: nameFillColour,
  [Constants.RECORD_27_JOIN_STYLE]: nameJoinStyle,
  [Constants.RECORD_28_LINE_CAP_END]: nameCapEndStyle,
  [Constants.RECORD_29_LINE_CAP_START]: nameCapStartStyle,
  [Constants.RECORD_2A_WINDING_RULE]: nameWindingRule,
  [Constants.RECORD_2B_DASH_PATTERN]: () => 'Dash pattern',
  [Constants.RECORD_2C_RECTANGLE]: () => 'Rectangle',
  [Constants.RECORD_2D_CHARACTER]: () => 'Character',
  [Constants.RECORD_34_ELLIPSE]: () => 'Ellipse',
  [Constants.RECORD_35_ROUNDED_RECTANGLE]: () => 'Rounded rectangle',
  [Constants.RECORD_37_DISTORTION_GROUP]: () => 'Distortion group',
  [Constants.RECORD_38_PERSPECTIVE_GROUP]: () => 'Perspective group',
  [Constants.RECORD_3A_BLEND_GROUP]: () => 'Blend group',
  [Constants.RECORD_3B_BLEND_OPTIONS]: () => 'Blend options',
  [Constants.RECORD_3D_BLEND_PATH]: () => 'Blend path',
  [Constants.RECORD_3E_MARKER_START]: () => 'Marker start',
  [Constants.RECORD_3F_MARKER_END]: () => 'Marker end',
  [Constants.RECORD_42_DISTORTION_SUBGROUP]: () => 'Distortion subgroup',
};

function nameArtworksRecord({ type, ...data }) {
  if (!type) {
    return 'List';
  }
  const maskedType = type & 0xFF;
  const nameFunction = NAME_FUNCTIONS_BY_TYPE[maskedType];
  if (nameFunction) {
    return nameFunction(data);
  }
  return maskedType.toString(16);
}

export default nameArtworksRecord;
