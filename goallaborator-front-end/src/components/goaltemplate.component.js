import React, { Component } from 'react';

import {
  Button, Form, FormGroup,
  Input,
  InputGroup,
  Jumbotron,
  ButtonGroup,
  InputGroupAddon
} from 'reactstrap';
import './goaltemplate.css';

export default class GoalTemplate extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.privateToggle = this.privateToggle.bind(this);
    this.categoryButtonCheck = this.categoryButtonCheck.bind(this);
    this.checkTitle = this.checkTitle.bind(this);
    this.titleButtonCheck = this.titleButtonCheck.bind(this);
    this.checkDescription = this.checkDescription.bind(this);
    this.descriptionButtonCheck = this.descriptionButtonCheck.bind(this);
    this.freqButtonCheck = this.freqButtonCheck.bind(this);
    this.state = {
      buttonInactive: true,
      goalTitle: "",
      goalDescription: "",
      categorySelected: null,
      freqCount: 1,
      isPrivate: false,
      error: null,

      titleInvalid: false,
      titleTouched: false,

      descriptionInvalid: false,
      descriptionTouched: false,

      goalCreated: false,
    };
  }

  componentDidMount() {
  }

  handleSubmit(e) {
    e.preventDefault();
    const { categorySelected, goalTitle, goalDescription,
      freqCount, isPrivate } = this.state;

    let createQuery = {
      query:
        `
          mutation {
            createGoal(
              goalInput: {category:"${categorySelected}",
                title:"${goalTitle}",
                description:"${goalDescription}",
                weeklyFrequency:${freqCount},
                private: ${isPrivate},
                completed: false
              }
            )
            {
              _id
              category 
              title
              description
              weeklyFrequency
              dateCreated
              private
            }
          }
        `
    };

    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(createQuery),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          console.log(res.json());
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState({
          goalCreated: true,
          buttonInactive: true,
          goalTitle: "",
          goalDescription: "",
          categorySelected: null,
          freqCount: 1,
          isPrivate: false,
          error: null,
          titleInvalid: false,
          titleTouched: false,
          descriptionInvalid: false,
          descriptionTouched: false
        });
      })
      .catch(err => {
        console.log(err);
        throw new Error("Failed");
      });
  }

  privateToggle(e) {
    const priv = e.target.value === "true";
    if (this.state.categorySelected && this.state.titleTouched && !this.state.titleInvalid
      && this.state.descriptionTouched && !this.state.descriptionInvalid) {
      this.setState({ buttonInactive: false, isPrivate: priv, error: null });
    } else {
      this.setState({ buttonInactive: true, isPrivate: priv });
    }
  }

  categoryButtonCheck(e) {
    if (this.state.titleTouched && !this.state.titleInvalid
      && this.state.descriptionTouched && !this.state.descriptionInvalid) {
      this.setState({ buttonInactive: false, categorySelected: e.target.value, error: null });
    } else {
      this.setState({ buttonInactive: true, categorySelected: e.target.value });
    }
  }

  checkTitle(e) {
    const isInvalid = e.target.value === "";
    this.setState({ titleInvalid: isInvalid });
    if (!isInvalid && this.state.categorySelected
      && this.state.descriptionTouched && !this.state.descriptionInvalid) {
      this.setState({ buttonInactive: false, goalTitle: e.target.value, error: null });
    } else {
      this.setState({ buttonInactive: true, goalTitle: e.target.value });
    }
  }

  titleButtonCheck(e) {
    const isInvalid = e.target.value === "";
    if (!isInvalid && this.state.categorySelected
      && this.state.descriptionTouched && !this.state.descriptionInvalid) {
      this.setState({ buttonInactive: false, goalTitle: e.target.value, error: null });
    } else {
      this.setState({ buttonInactive: true, goalTitle: e.target.value });
    }
  }

  checkDescription(e) {
    const isInvalid = e.target.value === "";
    this.setState({ descriptionInvalid: isInvalid });
    if (!isInvalid && this.state.categorySelected
      && this.state.titleTouched && !this.state.titleInvalid) {
      this.setState({ buttonInactive: false, goalDescription: e.target.value, error: null });
    } else {
      this.setState({ buttonInactive: true, goalDescription: e.target.value });
    }
  }

  descriptionButtonCheck(e) {
    const isInvalid = e.target.value === "";
    if (!isInvalid && this.state.categorySelected
      && this.state.titleTouched && !this.state.titleInvalid) {
      this.setState({ buttonInactive: false, goalDescription: e.target.value, error: null });
    } else {
      this.setState({ buttonInactive: true, goalDescription: e.target.value });
    }
  }

  freqButtonCheck(e) {
    if (this.state.titleTouched && !this.state.titleInvalid && this.state.categorySelected
      && this.state.descriptionTouched && !this.state.descriptionInvalid) {
      this.setState({ buttonInactive: false, freqCount: parseInt(e.target.value), error: null });
    } else {
      this.setState({ buttonInactive: true, freqCount: parseInt(e.target.value) });
    }
  }

  render() {
    return (
      <div>
        <div>
          <Jumbotron className="GoalBox">
            <h4 className="display-4 GoalBoxTitle">New Goal</h4>
            {this.state.goalCreated && <h5 style={{ 'color': 'green' }}>Your goal was created!</h5>}
            <br />
            {/*<Form action="/home" method="post">*/}
            <Form id="goal-create-form" onSubmit={this.handleSubmit}>
              <FormGroup>
                <InputGroup>
                  <ButtonGroup className="CategoryToggle">
                    <Button color="primary" outline value="false" onClick={this.privateToggle}
                      active={!this.state.isPrivate}>Public</Button>
                    <Button color="primary" outline value="true" onClick={this.privateToggle}
                      active={this.state.isPrivate}>Private</Button>
                  </ButtonGroup>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <ButtonGroup className="CategoryToggle">
                    <Button color="primary" outline value="general" onClick={this.categoryButtonCheck}
                      active={this.state.categorySelected === "general"}>General</Button>
                    <Button color="primary" outline value="diet" onClick={this.categoryButtonCheck}
                      active={this.state.categorySelected === "diet"}>Diet</Button>
                    <Button color="primary" outline value="wellness" onClick={this.categoryButtonCheck}
                      active={this.state.categorySelected === "wellness"}>Wellness</Button>
                    <Button color="primary" outline value="physical" onClick={this.categoryButtonCheck}
                      active={this.state.categorySelected === "physical"}>Physical</Button>
                    <Button color="primary" outline value="hobby" onClick={this.categoryButtonCheck}
                      active={this.state.categorySelected === "hobby"}>Hobby</Button>
                    <Button color="primary" outline value="creative" onClick={this.categoryButtonCheck}
                      active={this.state.categorySelected === "creative"}>Creative</Button>
                  </ButtonGroup>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <Input value={this.state.goalTitle} invalid={this.state.titleInvalid}
                    onFocus={() => this.setState({ titleTouched: true, goalCreated: false })}
                    onBlur={this.checkTitle}
                    onChange={this.titleButtonCheck}
                    maxLength="25" placeholder="Name"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <Input value={this.state.goalDescription} invalid={this.state.descriptionInvalid}
                    type="textarea" onFocus={() => this.setState({ descriptionTouched: true })}
                    onBlur={this.checkDescription}
                    onChange={this.descriptionButtonCheck}
                    maxLength="500" placeholder="Decription"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <ButtonGroup className="FreqSelect">
                    <InputGroupAddon addonType="prepend">
                      <Button color="dark" disabled>Weekly Frequency</Button>
                    </InputGroupAddon>
                    <Button color="primary" outline value="1" onClick={this.freqButtonCheck}
                      active={this.state.freqCount === 1} style={{ 'width': '55px' }}>1</Button>
                    <Button color="primary" outline value="2" onClick={this.freqButtonCheck}
                      active={this.state.freqCount === 2} style={{ 'width': '55px' }}>2</Button>
                    <Button color="primary" outline value="3" onClick={this.freqButtonCheck}
                      active={this.state.freqCount === 3} style={{ 'width': '55px' }}>3</Button>
                    <Button color="primary" outline value="4" onClick={this.freqButtonCheck}
                      active={this.state.freqCount === 4} style={{ 'width': '55px' }}>4</Button>
                    <Button color="primary" outline value="5" onClick={this.freqButtonCheck}
                      active={this.state.freqCount === 5} style={{ 'width': '55px' }}>5</Button>
                    <Button color="primary" outline value="6" onClick={this.freqButtonCheck}
                      active={this.state.freqCount === 6} style={{ 'width': '55px' }}>6</Button>
                    <Button color="primary" outline value="7" onClick={this.freqButtonCheck}
                      active={this.state.freqCount === 7} style={{ 'width': '55px' }}>7</Button>
                  </ButtonGroup>
                </InputGroup>
              </FormGroup>
              <Button block disabled={this.state.buttonInactive} color="primary">Create Goal</Button>
            </Form>
            <br />
          </Jumbotron>
        </div>
      </div>
    );
  }
}
