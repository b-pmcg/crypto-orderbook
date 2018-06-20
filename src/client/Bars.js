import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import { interpolateLab } from 'd3-interpolate';
import { select as d3Select } from 'd3-selection';

export default class Bars extends Component {
  constructor(props) {
    super(props);
  }

  setColor(data) {
    let hue;
    let lightness;
    if (data.orderType === 'Bids') {
      hue = '150'; // green
      switch (data.exchange) {
        case 'Poloniex':
          lightness = '30';
          break;
        case 'Bittrex':
          lightness = '60';
          break;
        case 'Binance':
          lightness = '90';
      }
    }
    if (data.orderType === 'Asks') {
      hue = '360'; // red
      switch (data.exchange) {
        case 'Poloniex':
          lightness = '30';
          break;
        case 'Bittrex':
          lightness = '60';
          break;
        case 'Binance':
          lightness = '90';
      }
    }
    const color = `hsla(${hue}, 100%, ${lightness}%, 1)`;
    return color;
  }

  render() {
    const {
      scales, margins, data, svgDimensions
    } = this.props;
    const { xScale, yScale } = scales;
    const { height } = svgDimensions;

    const bars = data.map(d => (
      <rect
        key={d.price + d.quantity}
        x={xScale(d.price)}
        y={yScale(d.quantity)}
        height={height - margins.bottom - scales.yScale(d.quantity)}
        width={xScale.bandwidth()}
        fill={this.setColor(d)}
      />
    ));

    return <g>{bars}</g>;
  }
}
