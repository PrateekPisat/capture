import React from 'react';
import ReactDOM from 'react-dom';import socket from "./socket";

class GameButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { arg, clickable, clickHandler } = this.props;
    if(clickable) {
      return arg ? clickHandler(arg) : clickHandler();
    }
  }

  //this turned out to be not too much code so it might be just moved into Game
  render() {
    const { purpose, clickable } = this.props;
    let className = 'btn btn-lg';
    if(!clickable) {
      className += ' disabled';
    }
    else {
      className += purposeClasses[purpose]
    }

    return <Button className={className}>{purpose}</Button>
  }
}