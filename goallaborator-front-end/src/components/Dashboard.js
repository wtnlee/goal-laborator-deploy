import React from 'react';
import { Redirect } from 'react-router-dom';
import '../index.css';
import { AppBar, Tabs, Tab, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles/";
import MyGoals from './MyGoals.js';
import Explore from './Explore.js';
import Profile from './Profile.js';
import GoalTemplate from './goaltemplate.component.js';
import { Button, Jumbotron } from "reactstrap";

const styles = theme => ({
  indicator: {
    backgroundColor: "#6BE0BF"
  }
});

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.checkLogin = this.checkLogin.bind(this);
    this.logout = this.logout.bind(this);
    this.setTabValue = this.setTabValue.bind(this);
    this.goToHome = this.goToHome.bind(this);

    this.state = {
      redirect: false,
      toHome: false,
      tabValue: 0,
    };
  }

  checkLogin(data) {
    try {
      let info = JSON.parse(data);
      if (info === null) this.goToHome();
      else { }
    } catch (e) {
      this.setState({
        toHome: true
      });
    }
  }

  componentDidMount() {
    fetch('/checkLogin', {
      method: 'GET',
      credentials: 'include',
    }).then(res => {
      res.json().then((data) => {
        if (data.login === false) {
          this.goToHome();
        }
      });
    }).catch(err => {
      console.log(err);
    });
  }

  logout() {
    fetch('/logout', {
      method: 'GET',
      credentials: 'include'
    }).then(res => {
      res.json().then((data) => {
        this.goToHome();
      });
    }).catch(err => {
      console.log(err);
    });
  }

  goToHome() {
    this.setState({
      toHome: true
    });
  }

  setTabValue(value) {
    this.setState({
      tabValue: value
    });
  }

  render() {
    const { classes } = this.props;
    let tabPage;

    if (this.state.toHome) {
      return <Redirect to='/' />;
    }

    if (this.state.tabValue === 0) {
      tabPage = <MyGoals />;
    }

    if (this.state.tabValue === 1) {
      tabPage = <Profile />;
    }

    if (this.state.tabValue === 2) {
      tabPage = <GoalTemplate />;
    }
    if (this.state.tabValue === 3) {
      tabPage = <Explore />;
    }

    return (
      <div className="Filler" style={{ backgroundColor: "white" }}>
        <AppBar position="static" style={{ backgroundColor: "#e9ecef", display: 'flex', flexDirection: 'row', paddingLeft: 25, paddingRight: 25 }}>
          <Grid
            justify="space-between"
            container
            spacing={24}
          >
            <Grid item>
              <div>
                <h2 role="button" onClick={() => this.goToHome()} style={{ float: "left", color: "#1A1A1A", fontWeight: 400, paddingRight: 50 }}>Goal-laborator</h2>
                <Tabs indicatorColor="primary" classes={{ indicator: classes.indicator }} value={this.state.tabValue}>
                  <Tab onClick={() => this.setTabValue(0)} style={{ color: "#1A1A1A", fontWeight: 600 }} disableRipple label="My Goals" />
                  <Tab onClick={() => this.setTabValue(1)} style={{ color: "#1A1A1A", fontWeight: 600 }} disableRipple label="Profiles" />
                  <Tab onClick={() => this.setTabValue(2)} style={{ color: "#1A1A1A", fontWeight: 600 }} disableRipple label="Create a Goal" />
                  <Tab onClick={() => this.setTabValue(3)} style={{ color: "#1A1A1A", fontWeight: 600 }} disableRipple label="Explore" />
                </Tabs>
              </div>
            </Grid>
            <Grid item>
              <div style={{ float: 'right', paddingLeft: 20, paddingRight: 25, paddingTop: 4, paddingBottom: 3 }}>
                <Button color="primary" onClick={this.logout} style={{ height: "40px", width: "100px", fontSize: 16, fontWeight: 700 }} size="sm">Logout</Button>
              </div>
            </Grid>
          </Grid>
        </AppBar>
        {tabPage}
      </div>

    );
  }
}

export default withStyles(styles)(Dashboard);
