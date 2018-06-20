import React, { Component } from 'react';
import './app.css';
import openSocket from 'socket.io-client';
import Chart from './Chart';
import OrderBook from './OrderBook';

// const socket = openSocket('http://localhost:8080');
// const socket = openSocket('http://159.65.75.193:8080');
const socket = openSocket('http://159.65.75.193');
const polling = 3000;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      asksPoloniex: [],
      bidsPoloniex: [],
      asksBittrex: [],
      bidsBittrex: [],
      asksBinance: [],
      bidsBinance: [],
      ordersPoloniex: [],
      ordersBittrex: [],
      ordersBinance: [],
      pairPrimary: 'BTC',
      pairSecondary: 'LTC',
      orderData: [],
      displayed: [],
      primaryCoins: ['BTC', 'ETH'],
      secondaryCoins: ['ETH', 'LTC', 'DOG', 'XRP', 'EOS']
    };
  }

  componentDidMount() {
    this.subToPoloniex();
    this.subToBittrex();
    this.subToBinance();
  }

  subToPoloniex() {
    socket.on('pushPoloniexData', (orderbook) => {
      if (orderbook) {
        const newAsksArray = [];
        const newBidsArray = [];
        orderbook.asks.map((ask) => {
          newAsksArray.push({
            Quantity: ask[1],
            Rate: parseFloat(ask[0]),
            Exchange: 'Poloniex',
            OrderType: 'Asks'
          });
        });
        orderbook.bids.map((bid) => {
          newBidsArray.push({
            Quantity: bid[1],
            Rate: parseFloat(bid[0]),
            Exchange: 'Poloniex',
            OrderType: 'Bids'
          });
        });
        this.setState({
          asksPoloniex: newAsksArray,
          bidsPoloniex: newBidsArray,
          ordersPoloniex: [...newAsksArray, ...newBidsArray]
        });
      }
    });
    socket.emit('getPoloniexData', polling, this.state.pairPrimary, this.state.pairSecondary);
  }

  subToBittrex() {
    socket.on('pushBittrexData', (orderbook) => {
      if (orderbook) {
        orderbook.sell.map((x) => {
          x.Exchange = 'Bittrex';
          x.OrderType = 'Asks';
          return x;
        });
        orderbook.buy.map((x) => {
          x.Exchange = 'Bittrex';
          x.OrderType = 'Bids';
          return x;
        });

        this.setState({
          asksBittrex: orderbook.sell.slice(0, 20),
          bidsBittrex: orderbook.buy.slice(0, 20),
          ordersBittrex: [...orderbook.sell.slice(0, 20), ...orderbook.buy.slice(0, 20)]
        });
      }
    });
    socket.emit('getBittrexData', 5000, this.state.pairPrimary, this.state.pairSecondary);
  }

  subToBinance() {
    socket.on('pushBinanceData', (orderbook) => {
      if (orderbook) {
        const newAsksArray = [];
        const newBidsArray = [];
        orderbook.asks.map((ask) => {
          newAsksArray.push({
            Quantity: parseFloat(ask[1]),
            Rate: parseFloat(ask[0]),
            Exchange: 'Binance',
            OrderType: 'Asks'
          });
        });
        orderbook.bids.map((bid) => {
          newBidsArray.push({
            Quantity: parseFloat(bid[1]),
            Rate: parseFloat(bid[0]),
            Exchange: 'Binance',
            OrderType: 'Bids'
          });
        });
        this.setState({
          asksBinance: newAsksArray,
          bidsBinance: newBidsArray,
          ordersBinance: [...newAsksArray, ...newBidsArray]
        });
      }
    });
    socket.emit('getBinanceData', 5000, this.state.pairPrimary, this.state.pairSecondary);
  }

  addPoloniex() {
    const displayed = this.state.displayed;
    displayed.indexOf('poloniex') === -1
      ? displayed.push('poloniex')
      : console.log('Poloniex already exists');
    const orderData = [...this.state.orderData, ...this.state.ordersPoloniex];
    this.setState({ orderData, displayed });
  }

  addBittrex() {
    const displayed = this.state.displayed;
    displayed.indexOf('bittrex') === -1
      ? displayed.push('bittrex')
      : console.log('Bittrex already exists');
    const orderData = [...this.state.orderData, ...this.state.ordersBittrex];
    this.setState({ orderData, displayed });
  }

  addBinance() {
    const displayed = this.state.displayed;
    displayed.indexOf('binance') === -1
      ? displayed.push('binance')
      : console.log('Binance already exists');
    const orderData = [...this.state.orderData, ...this.state.ordersBinance];
    this.setState({ orderData, displayed });
  }

  removePoloniex() {
    let orderData = [...this.state.orderData];
    const exDisplayed = this.state.displayed;
    if (exDisplayed.indexOf('binance') === -1 && exDisplayed.indexOf('bittrex') === -1) {
      orderData = [];
    } else if (exDisplayed.indexOf('binance') !== -1 && exDisplayed.indexOf('bittrex') === -1) {
      orderData = [...this.state.ordersPoloniex];
    } else if (exDisplayed.indexOf('binance') !== -1 && exDisplayed.indexOf('bittrex') !== -1) {
      orderData = [...this.state.ordersPoloniex, ...this.state.ordersBittrex];
    }

    const displayed = this.arrayRemove(exDisplayed, 'poloniex');
    this.setState({ orderData, displayed });
  }

  removeBittrex() {
    let orderData = [...this.state.orderData];
    const exDisplayed = this.state.displayed;
    if (exDisplayed.indexOf('poloniex') === -1 && exDisplayed.indexOf('binance') === -1) {
      orderData = [];
    } else if (exDisplayed.indexOf('poloniex') !== -1 && exDisplayed.indexOf('binance') === -1) {
      orderData = [...this.state.ordersPoloniex];
    } else if (exDisplayed.indexOf('poloniex') !== -1 && exDisplayed.indexOf('binance') !== -1) {
      orderData = [...this.state.ordersPoloniex, ...this.state.ordersBittrex];
    }

    const displayed = this.arrayRemove(exDisplayed, 'bittrex');
    this.setState({ orderData, displayed });
  }

  removeBinance() {
    let orderData = [...this.state.orderData];
    const exDisplayed = this.state.displayed;

    if (exDisplayed.indexOf('poloniex') === -1 && exDisplayed.indexOf('bittrex') === -1) {
      orderData = [];
    } else if (exDisplayed.indexOf('poloniex') !== -1 && exDisplayed.indexOf('bittrex') === -1) {
      orderData = [...this.state.ordersPoloniex];
    } else if (exDisplayed.indexOf('poloniex') !== -1 && exDisplayed.indexOf('bittrex') !== -1) {
      orderData = [...this.state.ordersPoloniex, ...this.state.ordersBittrex];
    }
    const displayed = this.arrayRemove(exDisplayed, 'binance');
    this.setState({ orderData, displayed });
  }

  arrayRemove(array, element) {
    return array.filter(e => e !== element);
  }

  render() {
    return (
      <div>
        <div className="container">
          <h1>Combine Exchanges</h1>
          <button onClick={this.addPoloniex.bind(this)}>Add Poloniex</button>
          <button onClick={this.removePoloniex.bind(this)}>Remove Poloniex</button>
          <button onClick={this.addBittrex.bind(this)}>Add Bittrex</button>
          <button onClick={this.removeBittrex.bind(this)}>Remove Bittrex</button>
          <button onClick={this.addBinance.bind(this)}>Add Binance</button>
          <button onClick={this.removeBinance.bind(this)}>Remove Binance</button>
          <h2>Currently displaying: {this.state.displayed.map(x => <span>{x} </span>)}</h2>
          <OrderBook orderData={this.state.orderData.sort((a, b) => a.Rate - b.Rate)} />
          <h1>Poloniex Live Updating</h1>
          <OrderBook orderData={this.state.ordersPoloniex.sort((a, b) => a.Rate - b.Rate)} />
          <h1>Bittrex Live Updating</h1>
          <OrderBook orderData={this.state.ordersBittrex.sort((a, b) => a.Rate - b.Rate)} />
          <h1>Binance Live Updating</h1>
          <OrderBook orderData={this.state.ordersBinance.sort((a, b) => a.Rate - b.Rate)} />
        </div>
      </div>
    );
  }
}
