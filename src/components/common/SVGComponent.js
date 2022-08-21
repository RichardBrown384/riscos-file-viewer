/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import PropTypes from 'prop-types';

const ATTRIBUTE_MAP_BY_TAG = {
  svg: {
    'xmlns:xlink': 'xmlnsXlink',
  },
  path: {
    'stroke-width': 'strokeWidth',
    'stroke-linejoin': 'strokeLinejoin',
    'stroke-linecap': 'strokeLinecap',
    'fill-rule': 'fillRule',
    'stroke-dashoffset': 'strokeDashoffset',
    'stroke-dasharray': 'strokeDasharray',
    'vector-effect': 'vectorEffect',
  },
  image: {
    'xlink:href': 'xlinkHref',
  },
  stop: {
    'stop-color': 'stopColor',
  },
};

function mapAttributeName(tag, attribute) {
  return ATTRIBUTE_MAP_BY_TAG[tag]?.[attribute] || attribute;
}

function mapAttributeNames(tag, attributes) {
  function reducer(accumulator, [name, value]) {
    return Object.assign(accumulator, {
      [mapAttributeName(tag, name)]: value,
    });
  }
  return Object.entries(attributes).reduce(reducer, {});
}

function mapElement({
  tag: Tag, attributes = {}, children = [], text = '',
}, index = 0) {
  function mapChildElements() {
    const result = [];
    for (let i = 0; i < children.length; i += 1) {
      result.push(mapElement(children[i], i));
    }
    return result;
  }

  const renamedAttributes = mapAttributeNames(Tag, attributes);

  if (children.length === 0 && text.length === 0) {
    return <Tag {...renamedAttributes} key={index} />;
  }

  return (
    <Tag {...renamedAttributes} key={index}>
      {mapChildElements()}
      {text && text}
    </Tag>
  );
}

function SVGComponent({ element }) {
  if (!element) {
    return null;
  }
  return (
    <div>{mapElement(element)}</div>
  );
}

SVGComponent.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  element: PropTypes.object.isRequired,
};

export default SVGComponent;
