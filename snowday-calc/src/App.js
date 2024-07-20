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

//styling
const styles = () => ({
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
      warningModalOpen: false,
      errorModalOpen: false,
      zipcode: '',
      exception: '',
      percent: 200
    }; 
  }

  handleClickOpen = () => {
    //check if field is filled before opening dialog
    //if the field is empty, an error dialog will be displayed
    if(this.state.zipcode === '') {
      this.setState({ errorModalOpen: true });
    //if the field is not empty, send a post request to the python server
    //with the provided information
    } else { 
      var zip = {zipcode: this.state.zipcode };
      fetch('http://localhost:5000/zipcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(zip)
      })
      .then(res => res.json())
      .then((result) => {
        const regex = /^\d{2}%$/;
        //if the information was invalid, the python server will catch this
        //error and return a question mark, and a warning dialog will be displayed
        if (!regex.test(result.percent)) {
          this.setState({
            exception: result.percent,
            warningModalOpen: true
          })
        //if the provided inforamtion was valid, the success dialog will be diaplayed
        } else {
          this.setState({
            percent: result.percent,
            successModalOpen: true
          })
        }
      })
    }
  };    

  handleClose = () => {
    this.setState({ successModalOpen: false });
    this.setState({ warningModalOpen: false});
    this.setState({ errorModalOpen: false });
  };
 
  //to handle the input
  handleChange = zipcode => event => {
    this.setState({ [zipcode]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.7.1/css/all.css' integrity='sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr' crossOrigin='anonymous'></link>
        
        <div className='App'>
          <header className='app-header'>
            <div>
              <i className='app-logo far fa-snowflake' alt='logo'></i>
              <h3 className='snowday-header'> Snow Day Calculator </h3>
              <i className='app-logo far fa-snowflake' alt='logo'></i>
            </div>
            <p className='prompt'> Input your zip code to determine your chance of a snow day.</p>
          </header>
          <footer className='app-footer'>
          <form className={classes.container} noValidate autoComplete='off'>
            <TextField
              id='outlined-name'
              label='Zipcode'
              className={classes.textField}
              value={this.state.zipcode}
              onChange={this.handleChange('zipcode')}
              margin='normal'
              variant='outlined'
              //disable default behavior of 'enter' key (default behavior refreshes the page)
              //now, hitting 'enter' will have the same behavior as clicking calculate
              onKeyPress={(event) => { 
                if (event.key === 'Enter') {
                  this.handleClickOpen();
                  event.preventDefault();
                }
              }}
            />
          </form>
            <Button variant='contained' color='primary' className={classes.calc} onClick={this.handleClickOpen}>
              Calculate</Button>
            <Dialog //the success dialog
              open={this.state.successModalOpen}
              TransitionComponent={Slide}
              keepMounted
              onClose={this.handleClose}
              aria-labelledby='calc-dialog-slide-title'
              aria-describedby='calc-dialog-slide-description'>
              <DialogTitle id='calc-dialog-slide-title'>
                {'Your chances of a snow day are...'}
              </DialogTitle>
              <DialogContent>
                <DialogContentText className={classes.successModal} id='calc-dialog-slide-description'>
                    Based on your input, the chance of a snow day for {this.state.zipcode} is {this.state.percent}%.
                </DialogContentText>
                <DialogContentText className={classes.progress}>
                    {this.state.percent}%
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color='primary'>
                  Close
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog //the warning dialog
              open={this.state.warningModalOpen}
              TransitionComponent={Slide}
              keepMounted
              onClose={this.handleClose}
              aria-labelledby='calc-warning-dialog-slide-title'
              aria-describedby='calc-warning-dialog-slide-description'>
              <DialogTitle id='calc-warning-dialog-slide-title'>
                {'Uh oh!'}
              </DialogTitle>
              <DialogContent>
                <DialogContentText className={classes.errorModal} id='calc-warning-dialog-slide-description'>
                    {this.state.exception}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color='primary'>
                  OK
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog //the error dialog
              open={this.state.errorModalOpen}
              TransitionComponent={Slide}
              keepMounted
              onClose={this.handleClose}
              aria-labelledby='calc-error-dialog-slide-title'
              aria-describedby='calc-error-dialog-slide-description'>
              <DialogTitle id='calc-error-dialog-slide-title'>
                {'Empty Fields'}
              </DialogTitle>
              <DialogContent>
                <DialogContentText className={classes.errorModal} id='calc-error-dialog-slide-description'>
                    Please fill out all fields to calculate the chance of a snow day.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color='primary'>
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
