/* eslint-disable no-bitwise */

import React, { Component } from 'react';
import * as d3 from 'd3';

import { Artworks } from 'riscos-artworks';
import PropTypes from 'prop-types';

const { Constants } = Artworks;

const FILL_TYPE_NAMES = ['flat', 'linear', 'radial'];

function nameStrokeColour({ strokeColour }) {
  return `Stroke (${strokeColour | 0})`;
}

function nameStrokeWidth({ strokeWidth }) {
  return `Stroke width (${strokeWidth})`;
}

function nameFillColour({ fillType }) {
  return `Fill (${FILL_TYPE_NAMES[fillType]})`;
}

const NAME_FUNCTIONS_BY_TYPE = {
  [Constants.RECORD_01_TEXT]: () => 'Text',
  [Constants.RECORD_02_PATH]: () => 'Path (2)',
  [Constants.RECORD_05_SPRITE]: () => 'Sprite',
  [Constants.RECORD_06_GROUP]: () => 'Group',
  [Constants.RECORD_0A_LAYER]: () => 'Layer',
  [Constants.RECORD_24_STROKE_COLOUR]: nameStrokeColour,
  [Constants.RECORD_25_STROKE_WIDTH]: nameStrokeWidth,
  [Constants.RECORD_26_FILL_COLOUR]: nameFillColour,
  [Constants.RECORD_27_JOIN_STYLE]: () => 'Join style',
  [Constants.RECORD_28_LINE_CAP_END]: () => 'Cap end',
  [Constants.RECORD_29_LINE_CAP_START]: () => 'Cap start',
  [Constants.RECORD_2A_WINDING_RULE]: () => 'Winding rule',
  [Constants.RECORD_2B_DASH_PATTERN]: () => 'Dash pattern',
  [Constants.RECORD_2C]: () => 'Path (2C)',
  [Constants.RECORD_2D_CHARACTER]: () => 'Character',
  [Constants.RECORD_34]: () => 'Path (34)',
  [Constants.RECORD_3A_BLEND_GROUP]: () => 'Blend group',
  [Constants.RECORD_3B_BLEND_OPTIONS]: () => 'Blend options',
  [Constants.RECORD_3D_BLEND_PATH]: () => 'Blend path',
  [Constants.RECORD_3E_MARKER_START]: () => 'Marker start',
  [Constants.RECORD_3F_MARKER_END]: () => 'Marker end',
};

function name({ type, ...data }) {
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

class ArtworksD3TreeComponent extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.buildTree();
  }

  componentDidUpdate() {
    this.buildTree();
  }

  buildTree() {
    const { data } = this.props;

    const width = 1600;

    const hierarchy = d3.hierarchy({
      children: data,
    });
    hierarchy.dx = 10;
    hierarchy.dy = width / (hierarchy.height + 1);
    const root = d3.tree().nodeSize([hierarchy.dx, hierarchy.dy])(hierarchy);

    let x0 = Infinity;
    let x1 = -x0;
    root.each((d) => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });

    this.ref.current.innerHTML = '';

    const svg = d3.select(this.ref.current)
      .append('svg')
      .attr('viewBox', [0, 0, width, x1 - x0 + root.dx * 2]);

    const g = svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('transform', `translate(${root.dy / 3},${root.dx - x0})`);

    // eslint-disable-next-line no-unused-vars
    const link = g.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(root.links())
      .join('path')
      .attr('d', d3.linkHorizontal()
        .x((d) => d.y)
        .y((d) => d.x));

    const node = g.append('g')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3)
      .selectAll('g')
      .data(root.descendants())
      .join('g')
      .attr('transform', (d) => `translate(${d.y},${d.x})`);

    node.append('circle')
      .attr('fill', (d) => (d.children ? '#555' : '#999'))
      .attr('r', 2.5);

    node.append('text')
      .attr('dy', '0.31em')
      .attr('x', (d) => (d.children ? -6 : 6))
      .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
      .text((d) => name(d.data))
      .clone(true)
      .lower()
      .attr('stroke', 'white');
  }

  render() {
    return <div ref={this.ref} />;
  }
}

ArtworksD3TreeComponent.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
};

export default ArtworksD3TreeComponent;
