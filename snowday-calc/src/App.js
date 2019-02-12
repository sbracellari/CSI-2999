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

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

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
      <div className="App">
        <header className="App-header">
          <p>Snow Day Calculator</p>
          <Button variant="outlined" className="btn-calc" onClick={this.handleClickOpen}>
            Calculate</Button>
          <Dialog
            open={this.state.open}
            TransitionComponent={Transition}
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
                in (selected-area) is (result-percent).
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </header>
      </div>
    );
  }
}

export default App;
