import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Button, Form, FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Jumbotron,
} from 'reactstrap';
import './login.css';
import { Link } from "react-router-dom";

const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default class Login extends Component {
  constructor() {
    super();
    this.checkUsername = this.checkUsername.bind(this);
    this.usernameButtonCheck = this.usernameButtonCheck.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.passwordButtonCheck = this.passwordButtonCheck.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);

    this.state = {
      loggedIn: false,
      buttonInactive: true,
      usernameTouched: false,
      usernameInvalid: false,
      passwordTouched: false,
      passwordInvalid: false,
      username: "",
      password: "",
    };
  }

  componentDidMount() {
    fetch('/checkLogin', {
      method: 'GET',
      credentials: 'include',
    }).then(res => {
      res.json().then((data) => {
        if (data.login) {
          this.setState({ loggedIn: true });
        }
      });
    }).catch(err => {
      console.log(err);
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { username, password } = this.state;
    console.log(username);
    console.log(password);

    fetch('/login', {
      method: 'POST',
      body: JSON.stringify({ "email": username, "password": password }),
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    }).then(res => {
      res.json().then((data) => {
        if (data.login) {
          this.login();
        } else {
          this.setState({ error: "Username or password was incorrect" });
        }
      });
    }).catch(err => {
      console.log(err);
    });
  }

  login() {
    this.setState({ loggedIn: true });
  }

  // Used regex instead of input type="email" so that invalid styling is
  // consistent, regex is same one used in built-in type="email" check
  checkUsername(e) {
    const isInvalid = e.target.value === "" || !(RegExp(emailRegex).test(e.target.value));
    this.setState({ usernameInvalid: isInvalid });
    if (!isInvalid && this.state.passwordTouched && !this.state.passwordInvalid) {
      this.setState({ buttonInactive: false, username: e.target.value });
    } else {
      this.setState({ buttonInactive: true, username: e.target.value });
    }
  }

  usernameButtonCheck(e) {
    const isInvalid = e.target.value === "" || !(RegExp(emailRegex).test(e.target.value));
    if (!isInvalid && this.state.passwordTouched && !this.state.passwordInvalid) {
      this.setState({ buttonInactive: false, username: e.target.value });
    } else {
      this.setState({ buttonInactive: true, username: e.target.value });
    }
  }

  checkPassword(e) {
    const isInvalid = e.target.value === "";
    this.setState({ passwordInvalid: isInvalid });
    if (!isInvalid && this.state.usernameTouched && !this.state.usernameInvalid) {
      this.setState({ buttonInactive: false, password: e.target.value });
    } else {
      this.setState({ buttonInactive: true, password: e.target.value });
    }
  }

  passwordButtonCheck(e) {
    const isInvalid = e.target.value === "";
    if (!isInvalid && this.state.usernameTouched && !this.state.usernameInvalid) {
      this.setState({ buttonInactive: false, password: e.target.value });
    } else {
      this.setState({ buttonInactive: true, password: e.target.value });
    }
  }

  render() {
    if (this.state.loggedIn) {
      return (
        <Redirect to={{ pathname: '/dashboard' }} />
      );
    }
    return (
      <div>
        <div>
          <Jumbotron className="LoginBox">
            <h4 className="display-4 LoginBoxTitle">Log In</h4>
            {this.state.error && <h5 style={{ 'color': 'red' }}>{this.state.error}</h5>}
            <br />
            {/*<Form action="/home" method="post">*/}
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">@</InputGroupAddon>
                  <Input invalid={this.state.usernameInvalid} placeholder="Email"
                    onFocus={() => this.setState({ usernameTouched: true })}
                    onBlur={this.checkUsername}
                    onChange={this.usernameButtonCheck}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">＊</InputGroupAddon>
                  <Input invalid={this.state.passwordInvalid} type="password" placeholder="Password"
                    onFocus={() => this.setState({ passwordTouched: true })}
                    onBlur={this.checkPassword}
                    onChange={this.passwordButtonCheck}
                  />
                </InputGroup>
              </FormGroup>
              <Button block disabled={this.state.buttonInactive} color="primary">Log In</Button>
            </Form>
            <br />
            <Link replace to="/sign-up" className="redirectLink">
              <Button block color="secondary">Create a New Account</Button>
            </Link>
          </Jumbotron>
        </div>
      </div>
    );
  }
}
