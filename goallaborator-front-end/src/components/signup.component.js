import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Button, Form, FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Jumbotron,
} from 'reactstrap';
import './signup.css';
import { Link } from "react-router-dom";

const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default class SignUp extends Component {
  constructor() {
    super();
    this.checkEmail = this.checkEmail.bind(this);
    this.emailButtonCheck = this.emailButtonCheck.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.passwordButtonCheck = this.passwordButtonCheck.bind(this);
    this.checkFirstName = this.checkFirstName.bind(this);
    this.firstNameButtonCheck = this.firstNameButtonCheck.bind(this);
    this.checkLastName = this.checkLastName.bind(this);
    this.lastNameButtonCheck = this.lastNameButtonCheck.bind(this);
    //this.checkLogin = this.checkLogin.bind(this);
    this.setLogin = this.setLogin.bind(this);
    this.birthdayCheck = this.birthdayCheck.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      loggedIn: false,
      accountCreated: false,

      buttonInactive: true,

      firstNameInvalid: false,
      firstNameTouched: false,

      lastNameInvalid: false,
      lastNameTouched: false,

      emailInvalid: false,
      emailTouched: false,

      passwordInvalid: false,
      passwordTouched: false,

      birthdayTouched: false,

      email: "",
      password: "",
      firstName: "",
      lastName: "",
      birthday: "",
      error: null,
    };
  }

  componentDidMount() {
    fetch('/checkLogin', {
      method: 'GET',
      credentials: 'include',
    }).then(res => {
      res.json().then((data) => {
        console.log(data);
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
    const { email, password, firstName, lastName } = this.state;

    let requestBody = {
      query:
        `
          query {
            login(email:"${email}", password:"${password}") {
              userId
              token
              tokenExpiration
            }
          }
        `
    };

    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        } else {
          return res.json();
        }
      })
      .then(resData => {
        if (resData.data.login.token) {
          this.setState({ loggedIn: true });
        }
      })
      .catch(err => {
        let createQuery = {
          query:
            `
              mutation {
                createUser(
                  userInput: {email:"${email}",
                  password:"${password}",
                  name:"${firstName + " " + lastName}"}
                )
                {
                  _id
                  email
                }
              }
            `
        };

        fetch('/graphql', {
          method: 'POST',
          body: JSON.stringify(createQuery),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(res => {
            if (res.status !== 200 && res.status !== 201) {
              throw new Error('Failed!');
            }
            return res.json();
          })
          .then(resData => {
            console.log(resData);
            this.setState({ accountCreated: true });
          })
          .catch(err => {
            throw new Error("Failed");
          });
      });
  }

  setLogin() {
    this.setState({ loggedIn: true });
  }

  // Email regular expression obtained from RFC 5322 Official Standard
  // Used instead of input type="email" so that invalid styling is consistent
  checkEmail(e) {
    const isInvalid = e.target.value === "" || !(RegExp(emailRegex).test(e.target.value));
    this.setState({ emailInvalid: isInvalid });
  }

  checkPassword(e) {
    this.setState({ passwordInvalid: SignUp.isEmpty(e.target.value) });
  }

  checkFirstName(e) {
    this.setState({ firstNameInvalid: SignUp.isEmpty(e.target.value) });
  }

  checkLastName(e) {
    this.setState({ lastNameInvalid: SignUp.isEmpty(e.target.value) });
  }

  emailButtonCheck(e) {
    const emailInvalid = e.target.value === "" || !(RegExp(emailRegex).test(e.target.value));
    const {
      passwordTouched, firstNameTouched, lastNameTouched, birthdayTouched,
      passwordInvalid, firstNameInvalid, lastNameInvalid
    } = this.state;
    const somethingUntouched = !passwordTouched || !firstNameTouched || !lastNameTouched || !birthdayTouched;
    const somethingInvalid = emailInvalid || passwordInvalid || firstNameInvalid || lastNameInvalid;
    this.setState({ email: e.target.value, buttonInactive: somethingUntouched || somethingInvalid });
  }

  passwordButtonCheck(e) {
    const passwordInvalid = SignUp.isEmpty(e.target.value);
    const {
      emailTouched, firstNameTouched, lastNameTouched, birthdayTouched,
      emailInvalid, firstNameInvalid, lastNameInvalid
    } = this.state;
    const somethingUntouched = !emailTouched || !firstNameTouched || !lastNameTouched || !birthdayTouched;
    const somethingInvalid = emailInvalid || passwordInvalid || firstNameInvalid || lastNameInvalid;
    this.setState({ password: e.target.value, buttonInactive: somethingUntouched || somethingInvalid });
  }


  firstNameButtonCheck(e) {
    const firstNameInvalid = SignUp.isEmpty(e.target.value);
    const {
      emailTouched, passwordTouched, lastNameTouched, birthdayTouched,
      emailInvalid, passwordInvalid, lastNameInvalid
    } = this.state;
    const somethingUntouched = !emailTouched || !passwordTouched || !lastNameTouched || !birthdayTouched;
    const somethingInvalid = emailInvalid || passwordInvalid || firstNameInvalid || lastNameInvalid;
    this.setState({ firstName: e.target.value, buttonInactive: somethingUntouched || somethingInvalid });
  }

  lastNameButtonCheck(e) {
    const lastNameInvalid = SignUp.isEmpty(e.target.value);
    const {
      emailTouched, passwordTouched, firstNameTouched, birthdayTouched,
      emailInvalid, passwordInvalid, firstNameInvalid
    } = this.state;
    const somethingUntouched = !emailTouched || !passwordTouched || !firstNameTouched || !birthdayTouched;
    const somethingInvalid = emailInvalid || passwordInvalid || firstNameInvalid || lastNameInvalid;
    this.setState({ lastName: e.target.value, buttonInactive: somethingUntouched || somethingInvalid });
  }

  birthdayCheck() {
    const {
      emailTouched, passwordTouched, firstNameTouched, lastNameTouched,
      emailInvalid, passwordInvalid, firstNameInvalid, lastNameInvalid
    } = this.state;
    const somethingUntouched = !emailTouched || !passwordTouched || !firstNameTouched || !lastNameTouched;
    const somethingInvalid = emailInvalid || passwordInvalid || firstNameInvalid || lastNameInvalid;
    this.setState({ birthdayTouched: true, buttonInactive: somethingUntouched || somethingInvalid });
  }
  // TODO: refactor for whitespace checking
  static isEmpty(s) {
    return s === "";
  }

  render() {
    if (this.state.loggedIn) {
      return (
        <Redirect to={{ pathname: '/dashboard' }} />
      );
    }
    if (this.state.accountCreated) {
      return (
        <Redirect to={{ pathname: '/' }} />
      );
    }
    return (
      <div>
        <div>
          <Jumbotron className="SignUpBox">
            <h4 className="display-4 SignUpBoxTitle">Sign Up</h4>
            <br />
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <InputGroup>
                  <Input invalid={this.state.firstNameInvalid}
                    placeholder="First Name"
                    onChange={this.firstNameButtonCheck}
                    onFocus={() => this.setState({ firstNameTouched: true })}
                    onBlur={this.checkFirstName} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <Input invalid={this.state.lastNameInvalid}
                    placeholder="Last Name"
                    onChange={this.lastNameButtonCheck}
                    onFocus={() => this.setState({ lastNameTouched: true })}
                    onBlur={this.checkLastName} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">@</InputGroupAddon>
                  <Input invalid={this.state.emailInvalid}
                    placeholder="Email"
                    onChange={this.emailButtonCheck}
                    onFocus={() => this.setState({ emailTouched: true })}
                    onBlur={this.checkEmail} />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">＊</InputGroupAddon>
                  <Input invalid={this.state.passwordInvalid} type="password"
                    onChange={this.passwordButtonCheck}
                    onFocus={() => this.setState({ passwordTouched: true })}
                    onBlur={this.checkPassword} placeholder="Password" />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <Input type="date"
                    onChange={(e) => this.setState({ birthday: e.target.value })}
                    onFocus={this.birthdayCheck} />
                </InputGroup>
              </FormGroup>
              <Button block disabled={this.state.buttonInactive} color="primary">Create Account</Button>
            </Form>
            <br />
            <Link replace to="/" className="redirectLink">
              <Button block color="secondary">Sign Into An Existing
                  Account</Button>
            </Link>
          </Jumbotron>
        </div>
      </div>
    );
  }
}