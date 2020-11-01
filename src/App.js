import React, { Component } from 'react';
import { AnimatePresence } from 'framer-motion'
import {
  HashRouter,
  Route,
  Switch,
} from "react-router-dom"


import Loader from "./components/js/Loader";
import MeshObject from './components/gl/Mesh'
import Computer from "./components/js/Computer";
import './App.css';

class App extends Component {
  state = { loading: true, audiostate: false };
  sleep = milliseconds => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };
  wait = async (milliseconds = 2000) => {
    await this.sleep(milliseconds);
    this.setState({
      loading: false
    });
  };

  componentDidMount() {
    this.wait(3000);
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    var vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    window.addEventListener("resize", this.handleWindowResize);

  }

  handleWindowResize = () => {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    var vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };


  render() {
    if (this.state.loading) return (<div className="App-container"><Loader /></div>);
    return (
      <div className="App-container">
        <HashRouter basename={process.env.PUBLIC_URL}>
          <AnimatePresence>
            <Switch>
              <Route path="/" exact>
                <MeshObject />
              </Route>
              <Route path="/pc">
                <Computer />
              </Route>
            </Switch>
          </AnimatePresence>
        </HashRouter>
      </div>
    );
  }
};

export default App;
