import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './index.css'
import Login from "./components/login.component";
import SignUp from "./components/signup.component";
import Dashboard from "./components/Dashboard";

export default () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path='/' component={Login} />
          <Route path="/sign-in" component={Login} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/dashboard" render={() => (
								<Dashboard />
							)} />
        </Switch>
      </div>
    </Router>
  );
}
