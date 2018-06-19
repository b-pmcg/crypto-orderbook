import React, { Component } from 'react';
import Chart from './Chart';

export default class OrderBook extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="bids-container">
        <div className="App-chart-container">
          <Chart data={this.props.orderData} />
        </div>
        <div className="bids-table">
          <table>
            <thead>
              <tr>
                <th>Quantity</th>
                <th>Price</th>
                <th>Order Type</th>
                <th>Exchange</th>
              </tr>
            </thead>
            <tbody>
              {this.props.orderData.map((bids, i) => (
                <tr key={i}>
                  <td>{bids.Quantity}</td>
                  <td>{bids.Rate}</td>
                  <td>{bids.OrderType}</td>
                  <td>{bids.Exchange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
