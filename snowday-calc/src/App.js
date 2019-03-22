import React from 'react';
import './App.css';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  calc: {
    fontSize: 'medium',
    marginTop: 20,
  },
  container: {
    display: 'block',
  },
  textField: {
    width: 300,
    display: 'flex',
  },
  input: {
    float: 'right',
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  successModal: {
    display: 'inline-block',
    width: '70%',
  },
  errorModal: {
    width: '100%',
  },
  progress: {
    display: 'inline-block',
    width: '20%',
    marginLeft: '10%',
    fontSize: 'xx-large',
    color: '#0d387c',
  },
});


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      successModalOpen: false,
      errorModalOpen: false,
      name: "",
      percent: 5
    }; 
  }

  handleClickOpen = () => {
    //Check if field is filled before opening dialog
    if(this.state.name === "") {
      this.setState({ errorModalOpen: true });
    } else {
      var zip = {zipcode: this.state.name };
      fetch("http://localhost:5000/zipcode", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(zip)
      });
      fetch("http://localhost:5000/zipcode", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            percent: result.percent
          });
        },
        (error) => {
          this.setState({
            error
          });
        }
      )
      this.setState({ successModalOpen: true });
    }
  };  

  handleClose = () => {
    this.setState({ successModalOpen: false });
    this.setState({ errorModalOpen: false });
  };
 
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossOrigin="anonymous"></link>
        
        <div className="App">
          <header className="app-header">
            <div>
              <i className="app-logo far fa-snowflake" alt="logo"></i>
              <h3 className="snowday-header"> Snow Day Calculator </h3>
              <i className="app-logo far fa-snowflake" alt="logo"></i>
            </div>
            <p className="prompt"> Input your zip code to determine your chance of a snow day.</p>
          </header>
          <footer className="app-footer">
          <form className={classes.container} noValidate autoComplete="off">
          <TextField
          id="outlined-name"
          label="Zipcode"
          className={classes.textField}
          value={this.state.name}
          onChange={this.handleChange('name')}
          margin="normal"
          variant="outlined"
          />
        </form>
            <Button variant="contained" color="primary" className={classes.calc} onClick={this.handleClickOpen}>
              Calculate</Button>
            <Dialog
              open={this.state.successModalOpen}
              TransitionComponent={Slide}
              keepMounted
              onClose={this.handleClose}
              aria-labelledby="calc-dialog-slide-title"
              aria-describedby="calc-dialog-slide-description">
              <DialogTitle id="calc-dialog-slide-title">
                {"Your chances of a snow day are..."}
              </DialogTitle>
              <DialogContent>
                <DialogContentText className={classes.successModal} id="calc-dialog-slide-description">
                    Based on your input, the chance of a snow day for {this.state.name} is {this.state.percent}%.
                </DialogContentText>
                <DialogContentText className={classes.progress}>
                    {this.state.percent}%
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog 
              open={this.state.errorModalOpen}
              TransitionComponent={Slide}
              keepMounted
              onClose={this.handleClose}
              aria-labelledby="calc-error-dialog-slide-title"
              aria-describedby="calc-error-dialog-slide-description">
              <DialogTitle id="calc-error-dialog-slide-title">
                {"Empty Fields"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText className={classes.errorModal} id="calc-error-dialog-slide-description">
                    Please fill out all fields to calculate the chance of a snow day.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  OK
                </Button>
              </DialogActions>
            </Dialog>
          </footer>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
