import React, { Component } from 'react';
import './app.css';
import openSocket from 'socket.io-client';
import Chart from './Chart';
import OrderBook from './OrderBook';

const socket = openSocket('http://localhost:8080');
// const socket = openSocket('http://159.65.75.193:8080');
// const socket = openSocket('http://159.65.75.193');
const polling = 1000;

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
      pairSecondary: 'ETH',
      orderData: [],
      displayed: [],
      primaryCoins: ['BTC'],
      secondaryCoins: ['ETH', 'LTC', 'XRP', 'EOS']
    };
  }

  componentDidMount() {
    this.subscribeAll();
  }

  subToPoloniex() {
    socket.on('pushPoloniexData', (orderbook) => {
      if (orderbook.asks && orderbook.bids) {
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
    console.log('poloniex sub', this.state.pairSecondary);
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
    socket.emit('getBittrexData', polling, this.state.pairPrimary, this.state.pairSecondary);
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
    socket.emit('getBinanceData', polling, this.state.pairPrimary, this.state.pairSecondary);
  }

  addPoloniex() {
    const displayed = this.state.displayed;
    displayed.indexOf('poloniex') === -1
      ? displayed.push('poloniex')
      : console.log('This item already exists');
    const orderData = [...this.state.orderData, ...this.state.ordersPoloniex];
    this.setState({ orderData, displayed });
  }

  addBittrex() {
    const displayed = this.state.displayed;
    displayed.indexOf('bittrex') === -1
      ? displayed.push('bittrex')
      : console.log('This item already exists');
    const orderData = [...this.state.orderData, ...this.state.ordersBittrex];
    this.setState({ orderData, displayed });
  }

  addBinance() {
    const displayed = this.state.displayed;
    displayed.indexOf('binance') === -1
      ? displayed.push('binance')
      : console.log('This item already exists');
    const orderData = [...this.state.orderData, ...this.state.ordersBinance];
    this.setState({ orderData, displayed });
  }

  removePoloniex() {
    let orderData = [...this.state.orderData];
    const exDisplayed = this.state.displayed;

    if (exDisplayed.indexOf('binance') === -1 && exDisplayed.indexOf('bittrex') === -1) {
      orderData = [];
      // px is there and bx is not there
    } else if (exDisplayed.indexOf('binance') !== -1 && exDisplayed.indexOf('bittrex') === -1) {
      orderData = [...this.state.ordersPoloniex];
      // px is there and bx is there
    } else if (exDisplayed.indexOf('binance') !== -1 && exDisplayed.indexOf('bittrex') !== -1) {
      orderData = [...this.state.ordersPoloniex, ...this.state.ordersBittrex];
    }

    const displayed = this.arrayRemove(exDisplayed, 'poloniex');
    console.log('displayed out', displayed);
    this.setState({ orderData, displayed });
  }

  removeBittrex() {
    let orderData = [...this.state.orderData];
    const exDisplayed = this.state.displayed;
    // none are there
    if (exDisplayed.indexOf('poloniex') === -1 && exDisplayed.indexOf('binance') === -1) {
      orderData = [];
      // px is there and bn is not there
    } else if (exDisplayed.indexOf('poloniex') !== -1 && exDisplayed.indexOf('binance') === -1) {
      orderData = [...this.state.ordersPoloniex];
      // px is there and bx is there
    } else if (exDisplayed.indexOf('poloniex') !== -1 && exDisplayed.indexOf('binance') !== -1) {
      orderData = [...this.state.ordersPoloniex, ...this.state.ordersBittrex];
    }

    const displayed = this.arrayRemove(exDisplayed, 'bittrex');
    console.log('displayed out', displayed);
    this.setState({ orderData, displayed });
  }

  removeBinance() {
    let orderData = [...this.state.orderData];
    const exDisplayed = this.state.displayed;

    if (exDisplayed.indexOf('poloniex') === -1 && exDisplayed.indexOf('bittrex') === -1) {
      orderData = [];
      // px is there and bx is not there
    } else if (exDisplayed.indexOf('poloniex') !== -1 && exDisplayed.indexOf('bittrex') === -1) {
      orderData = [...this.state.ordersPoloniex];
      // px is there and bx is there
    } else if (exDisplayed.indexOf('poloniex') !== -1 && exDisplayed.indexOf('bittrex') !== -1) {
      orderData = [...this.state.ordersPoloniex, ...this.state.ordersBittrex];
    }

    const displayed = this.arrayRemove(exDisplayed, 'binance');
    console.log('displayed out', displayed);
    this.setState({ orderData, displayed });
  }

  arrayRemove(array, element) {
    return array.filter(e => e !== element);
  }

  updateSecondary(value) {
    socket.destroy();
    console.log(value);
    this.setState({ pairSecondary: value }, () => this.subscribeAll());
  }

  subscribeAll() {
    console.log('suball');
    this.subToPoloniex();
    this.subToBittrex();
    this.subToBinance();
  }

  socketOff() {
    socket.destroy('pushPoloniexData');
    socket.destroy('pushBittrexData');
    socket.destroy('pushBinanceData');
  }

  render() {
    return (
      <div>
        <div className="select">
          <span>Select Secondary Trading Pair</span>
          <select onChange={e => this.updateSecondary(e.target.value)}>
            <option value={0}>Default Value</option>
            {this.state.secondaryCoins.map((item, idx) => (
              <option value={item} key={idx}>
                {`Example ${item}`}
              </option>
            ))}
          </select>
        </div>
        <button onClick={this.addPoloniex.bind(this)} />
        <button onClick={this.removePoloniex.bind(this)} />
        <button onClick={this.addBittrex.bind(this)} />
        <button onClick={this.removeBittrex.bind(this)} />
        <button onClick={this.addBinance.bind(this)} />
        <button onClick={this.removeBinance.bind(this)} />
        <button onClick={this.socketOff.bind(this)} />
        <div className="combined-container">
          <h1>Combined</h1>
          <h2>Currently displaying {this.state.displayed.map(x => <span>{x}</span>)}</h2>
          <OrderBook orderData={this.state.orderData.sort((a, b) => a.Rate - b.Rate)} />
          <h1>Poloniex</h1>
          <OrderBook orderData={this.state.ordersPoloniex.sort((a, b) => a.Rate - b.Rate)} />
          <h1>Bittrex</h1>
          <OrderBook orderData={this.state.ordersBittrex.sort((a, b) => a.Rate - b.Rate)} />
          <h1>Binance</h1>
          <OrderBook orderData={this.state.ordersBinance.sort((a, b) => a.Rate - b.Rate)} />
        </div>
      </div>
    );
  }
}
