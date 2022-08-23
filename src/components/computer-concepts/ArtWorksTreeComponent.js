import React, { Component } from 'react';
import * as d3 from 'd3';

import PropTypes from 'prop-types';
import nameArtworksRecord from '../../util/name-artworks-record';

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
      .text((d) => nameArtworksRecord(d.data))
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
