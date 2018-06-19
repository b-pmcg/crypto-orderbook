import React, { Component } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import Axes from './Axes';
import Bars from './Bars';
import ResponsiveWrapper from './ResponsiveWrapper';

class Chart extends Component {
  constructor() {
    super();
    this.xScale = scaleBand();
    this.yScale = scaleLinear();
  }

  render() {
    const data = [];

    this.props.data.map((x) => {
      const item = {
        price: x.Rate,
        quantity: x.Quantity,
        exchange: x.Exchange,
        orderType: x.OrderType
      };
      data.push(item);
    });

    const margins = {
      top: 50,
      right: 20,
      bottom: 100,
      left: 60
    };

    const svgDimensions = {
      width: Math.max(this.props.parentWidth, 300),
      height: 500
    };

    const maxValue = Math.max(...data.map(d => d.quantity));

    const xScale = this.xScale
      .padding(0.5)
      .domain(data.map(d => d.price))
      .range([margins.left, svgDimensions.width - margins.right]);

    const yScale = this.yScale
      .domain([0, maxValue])
      .range([svgDimensions.height - margins.bottom, margins.top]);

    return (
      <svg width={svgDimensions.width} height={svgDimensions.height}>
        <Axes scales={{ xScale, yScale }} margins={margins} svgDimensions={svgDimensions} />
        <Bars
          scales={{ xScale, yScale }}
          margins={margins}
          data={data}
          maxValue={maxValue}
          svgDimensions={svgDimensions}
        />
      </svg>
    );
  }
}

export default ResponsiveWrapper(Chart);
