import React from 'react';
import './App.css';
//import PropTypes from 'prop-types';
//import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';


class App extends React.Component {
  state = {
    open: false,
  };
  
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  
  render() {
    return (
      <div>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous"></link>
        
        <div className="App">
          <header className="app-header">
            <p>
              <i className="app-logo far fa-snowflake" alt="logo"></i>
              <strong> Snow Day Calculator </strong>
              <i className="app-logo far fa-snowflake" alt="logo"></i></p>
          </header>
          <body className="app-body">
            <Button variant="outlined" className="btn-calc" onClick={this.handleClickOpen}>
              Calculate</Button>
            <Dialog
              open={this.state.open}
              TransitionComponent={Slide}
              keepMounted
              onClose={this.handleClose}
              aria-labelledby="calc-dialog-slide-title"
              aria-describedby="calc-dialog-slide-description">

              <DialogTitle id="calc-dialog-slide-title">
                {"Your chances of a snow day are..."}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="calc-dialog-slide-description">
                  Based on your input, the chance of a snow day on (selected-date) 
                  for (selected-school) is (result-percent).
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </body>
        </div>
      </div>
    );
  }
}

export default App;
