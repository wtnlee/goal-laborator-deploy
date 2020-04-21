import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Button } from 'reactstrap';
import Typography from '@material-ui/core/Typography';

import './GoalCard.css';

export default class FriendCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outline: "black solid 3px",
      visible: true,

      button1: props.button1,
      button1Visible: false,
      button2Visible: false,
      button2: props.button2
    };

    if (props.button1 !== "") {
      this.state.button1Visible = true;
    }
    if (props.button2 !== "") {
      this.state.button2Visible = true;
    }

    this.accept = this.accept.bind(this);
    this.reject = this.reject.bind(this);
  }

  accept() {
    console.log(this.props.id);
    let requestBody = {
      query:
        `
      mutation{
        updateFriendRequest(friendId : "${this.props.id}", accepted : ${true})
      }
    `
    };

    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then((resp) => {
      if (resp.errors) {
        console.log(resp);
        console.log("Friend accept failed");
      }
      else {
        this.setState({
          visible: false
        });
      }
    });
  }

  reject() {
    let requestBody = {
      query:
        `
      mutation {
          updateFriendRequest(friendId : "${this.props.id}", accepted : ${false})
      }
    `
    };
    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then((resp) => {
      if (resp.errors) {
        console.log(resp);
        console.log("Friend accept failed");
      }
      else {
        this.setState({
          visible: false
        });
      }
    });
  }

  render() {
    return (
      <div>
        {console.log(this.state.outline)}
        {this.state.visible ? <Card className="root" style={{ outline: "#007bff solid 3px" }}>
          <CardContent>
            <Typography className="title" color="textSecondary" gutterBottom>
              {this.props.status === "Pending" ? "Pending Friend" : "Friend Request"}
            </Typography>
            <Typography variant="h5" component="h2">
              {this.props.friendName}
            </Typography>
            <Typography className="pos" color="textSecondary">
              {this.props.email}
            </Typography>
          </CardContent>
          <CardActions>
            {this.state.button1Visible && (this.state.button1 === "Accept") ? <Button color="primary" outline size="small" onClick={this.accept}> {this.state.button1} </Button> :
              this.state.button1Visible && (this.state.button1 === "Reject") ? <Button color="primary" outline size="small" onClick={this.reject} > {this.state.button1}</Button> : null}

            {this.state.button2Visible && (this.state.button2 === "Accept") ? <Button outline size="small" onClick={this.accept}> {this.state.button2} </Button> :
              this.state.button2Visible && (this.state.button2 === "Reject") ? <Button color="primary" outline size="small" onClick={this.reject}> {this.state.button2} </Button> : null}
          </CardActions>

        </Card> : null}
      </div>
    );
  }
}
