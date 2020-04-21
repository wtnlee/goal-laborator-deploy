import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Button, CardFooter } from 'reactstrap';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './GoalCard.css';


var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";


export default class GoalCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outline: "#007bff solid 4px",
      expanded: false,
      collaborators: this.props.collaborators,
      goalId: this.props.goalID,
      visible: true,

      // checkIns :this.props.checkins
    };
    if (props.button1 === "CheckIn") {
      this.state.button1 = "Check In";
      this.state.button1Visible = true;
      this.state.outline = "red solid 4px";
    }

    if (props.button1 === "Complete") {
      this.state.button1 = "Complete";
      this.state.button1Visible = true;
      this.state.outline = "green solid 4px";
    }

    if (props.button2 === "CheckIn") {
      this.state.button2 = "Check In";
      this.state.button2Visible = true;
      this.state.outline = "red solid 4px";
    }

    if (props.button2 === "Complete") {
      this.state.button2 = "Complete";
      this.state.button2Visible = true;
    }

    if (props.button1 === "" && props.button2 === "") {
      this.state.outline = "green solid 4px";
    }

    if (props.completed === true) {
      this.state.outline = "orange solid 4px";
    }

    if (props.button2 === "Collaborate") {
      this.state.button2 = "Collaborate";
      this.state.button2Visible = true;
      this.state.outline = "#007bff solid 4px";
    }

    if (props.button1 === "Collaborate") {
      this.state.button1 = "Collaborate";
      this.state.button1Visible = true;
      this.state.outline = "#007bff solid 4px";
    }

    // else if(props.completed != true & ){
    //   this.state.outline = "orange solid 4px"
    // }

    this.submitCollaborate1 = this.submitCollaborate1.bind(this);
    this.submitComplete1 = this.submitComplete1.bind(this);
    this.submitCheckIn1 = this.submitCheckIn1.bind(this);

    this.submitCollaborate2 = this.submitCollaborate2.bind(this);
    this.submitComplete2 = this.submitComplete2.bind(this);
    this.submitCheckIn2 = this.submitCheckIn2.bind(this);
    this.checkIn = this.checkIn.bind(this);

    this.complete = this.complete.bind(this);
    this.collaborate = this.collaborate.bind(this);
  
  }

  collaborate(buttonNum) {
    let requestBody = {
      query:
        `mutation{
          collaborateOnGoal(goalId : "${this.state.goalId}"){
            _id
          }
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
      console.log(res);
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(res => {
      console.log(res);
      if (res.data.collaborateOnGoal._id) {
        if (buttonNum === 1) {
          this.setState({
            button1Visible: false,
            outline: "#007bff solid 4px",
            
          });
          if(this.props.shouldDis){
            this.setState({visible: false})
          }
        }

        else {
          this.setState({
            button2Visible: false,
            outline: "#007bff solid 4px",
            visible: false,
          });
          if(this.props.shouldDis){
            this.setState({visible: false})
          }
        }
      }
      else {
        console.log("Failed to submit collaborate");
      }
    }
    );
  }

  checkIn(buttonNum) {
    let requestBody = {
      query:
        `mutation{
          goalCheckIn(goalId : "${this.state.goalId}"){
            points
          }
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
      console.log(res);
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(res => {
      console.log(res);
      if (res.data.goalCheckIn.points > 0) {
        if (buttonNum === 1) {
          this.setState({
            button1Visible: false,
            outline: "green solid 4px"
          });
        }

        else {
          this.setState({
            button2Visible: false,
            outline: "green solid 4px"
          });
        }
      }
      else {
        console.log("Failed to submit checkin");
      }
    }
    );

  }

  complete(buttonNum) {
    console.log(typeof (this.state.goalId));
    let requestBody = {
      query:
        `mutation{
          completeGoal(goalId : "${this.state.goalId}", completedGoal : ${true}){
            _id
          }
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
      console.log(res);
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(res => {
      console.log(res);
      if (res.data.completeGoal._id) {
        if (buttonNum === 1) {
          this.setState({
            button1Visible: false,
            button2Visible: false,
            outline: "orange solid 4px"
          });
        }

        else {
          this.setState({
            button2Visible: false,
            button1Visible: false,
            outline: "orange solid 4px"
          });
        }
      }
      else {
        console.log("Failed to submit completion");
      }
    }
    );

  }


  submitCollaborate1() {
    console.log("Submitted a Collaborate for" + this.state.goalId);
    this.collaborate(1);
  }
  submitComplete1() {
    console.log("Submitted a Complete for" + this.state.goalId);
    this.complete(1);
  }

  submitCheckIn1() {
    console.log("Submitted a Check In for" + this.state.goalId);
    this.checkIn(1);
  }

  submitCollaborate2() {
    console.log("Submitted a Collaborate for" + this.state.goalId);
    this.setState({
      button2Visible: false
    });
  }
  submitComplete2() {
    console.log("Submitted a Complete for" + this.state.goalId);
    this.complete(2);
  }

  submitCheckIn2() {
    console.log("Submitted a Check In for" + this.state.goalId);
    this.checkIn(2);
  }



  render() {

    return (
      <div>
        {this.state.visible ? <Card className="root" style={{ outline: this.state.outline }}>
          <CardContent>
            <Typography className="title" color="textSecondary" gutterBottom>
              {this.props.goalCategory}
            </Typography>
            <Typography variant="h5" component="h2">
              {this.props.goalName}
            </Typography>
            <Typography className="pos" color="textSecondary">
              {this.props.goalText}
            </Typography>
          </CardContent>
          <CardActions>
            {this.state.button1Visible && (this.state.button1 === "Check In") ? <Button color={this.state.outline === "green solid 4px" ? "success" : this.state.outline === "red solid 4px" ? "danger" : "primary"}
              outline size="small" onClick={this.submitCheckIn1}> {this.state.button1} </Button> :
              this.state.button1Visible && (this.state.button1 === "Collaborate") ? <Button color={this.state.outline === "green solid 4px" ? "success" : this.state.outline === "red solid 4px" ? "danger" : "primary"}
                outline size="small" onClick={this.submitCollaborate1}> {this.state.button1} </Button> :
                this.state.button1Visible && (this.state.button1 === "Complete") ? <Button color={this.state.outline === "green solid 4px" ? "success" : this.state.outline === "red solid 4px" ? "danger" : "primary"}
                  outline size="small" onClick={this.submitComplete1}> {this.state.button1} </Button> : null}

            {this.state.button2Visible && (this.state.button2 === "Check In") ? <Button color={this.state.outline === "green solid 4px" ? "success" : this.state.outline === "red solid 4px" ? "danger" : "primary"}
              outline size="small" onClick={this.submitCheckIn2}> {this.state.button2} </Button> :
              this.state.button2Visible && (this.state.button2 === "Collaborate") ? <Button color={this.state.outline === "green solid 4px" ? "success" : this.state.outline === "red solid 4px" ? "danger" : "primary"}
                outline size="small" onClick={this.submitCollaborate2}> {this.state.button2} </Button> :
                this.state.button2Visible && (this.state.button2 === "Complete") ? <Button color={this.state.outline === "green solid 4px" ? "success" : this.state.outline === "red solid 4px" ? "danger" : "primary"}
                  outline size="small" onClick={this.submitComplete2}> {this.state.button2} </Button> : null}
          </CardActions>

          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h6" >Collaborators</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {
                this.props.collaborators ? this.props.collaborators.map((entry, i) => {

                  return <Typography key={i+entry}>
                    {entry}
                  </Typography>;

                }) : null
              }

            </ExpansionPanelDetails>
          </ExpansionPanel>

          {this.state.button1 !== "Collaborate" ? <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h6" >Check-Ins This Week</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>

              {
                this.props.checkIns ? this.props.checkIns.map((entry, i) => {

                  return <Typography key={this.state.goalId + i + entry}>
                    {weekday[new Date(entry).getDay()]}
                  </Typography>;

                }) : null
              }

            </ExpansionPanelDetails>
          </ExpansionPanel> : null}
          {this.props.creatorName && <CardFooter className="text-muted">Creator: {this.props.creatorName}</CardFooter>}
        </Card> : null}
      </div>
    );
  }
}
