import React from 'react';
import './App.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const styles =  theme => ({
  calc: {
    fontSize: 'medium',
    marginTop: 20,
  },
  container: {
    display: 'block',
  },
  textField: {
    marginRight: 0,
    width: 200,
    display: 'flex',
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  modal: {
    display: 'inline-block',
    width: '70%',
  },
  progress: {
    display: 'inline-block',
    width: '20%',
    marginLeft: '10%',
    fontSize: 'xx-large',
    color: '#0d387c',
  },
});

const states = [
  {
    value: 'Michigan',
    label: 'MI',
  },
];

const cities = [
  {
    value: 'Rochester',
    label: 'Rochester',
  },
];

const schools = [
  {
    value: 'Rochester Adams',
    label: 'Rochester Adams',
  },
  {
    value: 'Oakland University',
    label: 'Oakland University',
  },
  {
    value: 'Oakland Community College',
    label: 'Oakland Community College',
  },
];

class App extends React.Component {
  state = {
    modalOpen: false,
    completed: 54, //static value for now
    states: 'USA',
    cities: 'MI',
    schools: 'Rochester',
    date: 'mm/dd/yyyy',
  };

  handleClickOpen = () => {
    this.setState({ modalOpen: true });
  };

  handleClose = () => {
    this.setState({ modalOpen: false });
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
            <p>
              <i className="app-logo far fa-snowflake" alt="logo"></i>
              <strong> Snow Day Calculator </strong>
              <i className="app-logo far fa-snowflake" alt="logo"></i></p>
          </header>
          <footer className="app-footer">
          <form className={classes.container} noValidate autoComplete="off">
          <TextField
          id="date"
          label="Select a date"
          type="date"
          className={classes.textField}
          InputLabelProps={{
          shrink: true,
          }}
          />
          <TextField
          id="standard-select-state"
          select
          label="Select your state"
          className={classes.textField}
          value={this.state.states}
          onChange={this.handleChange('states')}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          margin="normal"
        >
          {states.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="standard-select-city"
          select
          label="Select your city"
          className={classes.textField}
          value={this.state.cities}
          onChange={this.handleChange('cities')}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          margin="normal"
        >
          {cities.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="standard-select-school"
          select
          label="Select your school"
          className={classes.textField}
          value={this.state.schools}
          onChange={this.handleChange('schools')}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          margin="normal"
        >
          {schools.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        </form>
            <Button variant="outlined" className={classes.calc} onClick={this.handleClickOpen}>
              Calculate</Button>
            <Dialog
              open={this.state.modalOpen}
              TransitionComponent={Slide}
              keepMounted
              onClose={this.handleClose}
              aria-labelledby="calc-dialog-slide-title"
              aria-describedby="calc-dialog-slide-description">
              <DialogTitle id="calc-dialog-slide-title">
                {"Your chances of a snow day are..."}
              </DialogTitle>
              <DialogContent>
                <DialogContentText className={classes.modal} id="calc-dialog-slide-description">
                    Based on your input, the chance of a snow day on (selected-date) for {this.state.schools} is {this.state.completed}%.
                </DialogContentText>
                <DialogContentText className={classes.progress}>
                    {this.state.completed}%
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Close
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
