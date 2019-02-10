import React, { Component } from 'react';
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  render() {

    return (
	  <div className="App">
		<header className="App-header">
			<h1>
				Snowday Calculator
			</h1>
			<Button id="btn_calc" variant="contained" size="large" color="primary">
				Calculate
			</Button>
		</header>
	  </div>
    );
  }
}

export default App;
