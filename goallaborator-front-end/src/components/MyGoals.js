import React from 'react';

import GoalCard from './GoalCard';
import './MyGoals.css';
import FriendCard from './FriendCard';

Object.values = Object.values || function (o) { return Object.keys(o).map(function (k) { return o[k]; }); };

export default class MyGoals extends React.Component {
  // remember to bind goal id to this for query!
  constructor(props) {
    super(props);
    this.state = {
      personalGoals: [],
      collaborations: [],
      friendRequests: [],
      pendingRequests: []
    };
    this.getMyGoals = this.getMyGoals.bind(this);
    this.getMyCollabs = this.getMyCollabs.bind(this);
    this.getMyPendingRequests = this.getMyPendingRequests.bind(this);
    this.getMyFriendRequests = this.getMyFriendRequests.bind(this);
    this.getMyFriendRequests();
    this.getMyPendingRequests();
    this.getMyGoals();
    this.getMyCollabs();
  }

  getMyPendingRequests() {
    let requestBody = {
      query:
        `
          query{
            me{
              pendingRequests{
                _id
                name
                email
              }
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
      console.log(res);
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(async (arr) => {
      console.log(arr);

      if (arr) {
        console.log(arr);

        let friendArray = arr.data.me.pendingRequests;
        let pendingReqs = await friendArray.map((entry, i) => {
          return <div key={i} style={{ paddingTop: 12.5, paddingBottom: 12.5, paddingLeft: 45, paddingRight: 45 }}>
            <FriendCard
              status="Pending"
              friendName={entry.name}
              email={entry.email}
              id={entry._id}
            />
          </div>;
        });
        this.setState({
          pendingRequests: pendingReqs
        });
      }
    });
  }

  getMyFriendRequests() {
    let requestBody = {
      query:
        `
          query{
            me{
              friendRequests{
                _id
                name
                email
              }
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
      console.log(res);
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(async (arr) => {
      if (arr) {
        console.log(arr);
        let friendArray = arr.data.me.friendRequests;
        let friendReqs = await friendArray.map((entry, i) => {
          return <div key={i} style={{ paddingTop: 12.5, paddingBottom: 12.5, paddingLeft: 45, paddingRight: 45 }}>
            <FriendCard
              status="Received"
              friendName={entry.name}
              email={entry.email}
              id={entry._id}
              button1="Accept"
              button2="Reject"
            />
          </div>;
        });
        this.setState({
          friendRequests: friendReqs
        });
      }
    });
  }

  getMyGoals() {
    let requestBody = {
      query:
        `
          query{
            myDashboardCreatedGoals{
              goal {
                _id
                category
                title
                description
                completed
                title
                collaborators{
                    email
                }
              }
              checkIns
              shouldCheckIn
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
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(async (arr) => {
      if (arr.data) {
        //  console.log(arr);
        let contents = arr.data.myDashboardCreatedGoals;
        let results = await contents.map((entry, i) => {
          let emails = [];
          for (let i = 0; i < entry.goal.collaborators.length; i++) {
            emails.push(entry.goal.collaborators[i]['email']);
          }
          if (entry.shouldCheckIn === true) {
            if (entry.goal.completed) {
              return <div key={i} style={{ paddingTop: 12.5, paddingBottom: 12.5, paddingLeft: 45, paddingRight: 45 }}>
                <GoalCard
                  goalName={entry.goal.title}
                  goalText={entry.goal.description}
                  goalCategory={entry.goal.category}
                  goalID={entry.goal._id}
                  checkIns={entry.checkIns}
                  collaborators={emails}
                  shouldDis = {true}
                  completed={entry.goal.completed}
                  button1=""
                  button2="" />
              </div>;
            }
            else {
              return <div key={i} style={{ paddingTop: 12.5, paddingBottom: 12.5, paddingLeft: 45, paddingRight: 45 }}>
                <GoalCard
                  goalName={entry.goal.title}
                  goalText={entry.goal.description}
                  goalCategory={entry.goal.category}
                  goalID={entry.goal._id}
                  checkIns={entry.checkIns}
                  collaborators={emails}
                  completed={entry.goal.completed}
                  shouldDis = {true}
                  button1="CheckIn"
                  button2="Complete" />
              </div>;
            }
          }
          else {
            if (entry.goal.completed) {
              return <div key={i} style={{ paddingTop: 12.5, paddingBottom: 12.5, paddingLeft: 45, paddingRight: 45 }}>
                <GoalCard
                  goalName={entry.goal.title}
                  goalText={entry.goal.description}
                  goalCategory={entry.goal.category}
                  goalID={entry.goal._id}
                  shouldDis = {true}
                  collaborators={emails}
                  completed={entry.goal.completed}
                  checkIns={entry.checkIns}
                  button1=""
                  button2="" />
              </div>;
            }
            else {
              return <div key={i} style={{ paddingTop: 12.5, paddingBottom: 12.5, paddingLeft: 45, paddingRight: 45 }}>
                <GoalCard
                  goalName={entry.goal.title}
                  goalText={entry.goal.description}
                  goalCategory={entry.goal.category}
                  goalID={entry.goal._id}
                  collaborators={emails}
                  shouldDis = {true}
                  completed={entry.goal.completed}
                  checkIns={entry.checkIns}
                  button1="Complete"
                  button2="" />
              </div>;
            }
          }
        });
        console.log(results);
        this.setState({
          personalGoals: results
        });
      }
      else {
        console.log("You have no goals");
      }
    });
  }

  getMyCollabs() {
    let requestBody = {
      query:
        `
          query{
            myDashboardCollaboratedGoals{
              goal {
                _id
                category
                creator{
                  name
                }
                title
                description
                title
                completed
                collaborators {
                    email
                }
              }
              checkIns
              shouldCheckIn
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
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(async (arr) => {
       console.log(arr);
      //  console.log(arr);
     // let contents = arr.data.myDashboardCollaboratedGoals;

      if (arr.data) {
        let contents = arr.data.myDashboardCollaboratedGoals;

        console.log(contents);
        let results = await contents.map((entry, i) => {
          let emails = [];
          for (let i = 0; i < entry.goal.collaborators.length; i++) {
            emails.push(entry.goal.collaborators[i]['email']);
          }
          if (entry.shouldCheckIn === true && entry.goal.completed === false) {
            return <div key={i + entry.goal._id} style={{ paddingTop: 12.5, paddingBottom: 12.5, paddingLeft: 45, paddingRight: 45 }}>
              <GoalCard
                goalName={entry.goal.title}
                goalText={entry.goal.description}
                goalCategory={entry.goal.category}
                goalID={entry.goal._id}
                shouldDis = {true}
                checkIns={entry.checkIns}
                collaborators={emails}
                completed={entry.goal.completed}
                creatorName={entry.goal.creator.name}
                button1="CheckIn"
                button2="" />
            </div>;
          }
          else {
            return <div key={i+ entry.goal._id} style={{ paddingTop: 12.5, paddingBottom: 12.5, paddingLeft: 45, paddingRight: 45 }}>
              <GoalCard
                goalName={entry.goal.title}
                goalText={entry.goal.description}
                goalCategory={entry.goal.category}
                goalID={entry.goal._id}
                collaborators={emails}
                shouldDis = {true}
                checkIns={entry.checkIns}
                creatorName={entry.goal.creator.name}
                completed={entry.goal.completed}
                button1=""
                button2="" />
            </div>;
          }
        });
        console.log(results);
        this.setState({
          collaborations: results
        });
      }
    });
  }

  render() {
    return (
      <div style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0, display: 'flex', flexDirection: 'row' }} >
        <div className='left-wrapper' style={{ paddingTop: 25, paddingLeft: 25, paddingRight: 25, display: 'flex', flexDirection: 'column' }}>
          <div style={{ paddingLeft: 0, paddingRight: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>

            <div className="large-header-column" style={{ paddingLeft: 0, paddingRight: 0, }}>
              <h1 className="large-card-text-middle">My Goals</h1>
            </div>

            <div className="large-header-column" style={{ paddingLeft: 0, }}>
              <h1 className="large-card-text-middle">My Collaborations</h1>
            </div>

          </div>
          <div style={{ paddingTop: 25, paddingBottom: 25, paddingLeft: 25, paddingRight: 25, display: 'flex', flexDirection: 'row' }}>

            <div className='news-container gray' >
              {this.state.personalGoals}
            </div>

            <div className='news-container gray' >
              {this.state.collaborations}
            </div>
            
          </div>
        </div>

        <div className='friends-container' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          <div style={{ paddingTop: 20 }}>
            <h1 className="large-card-text-middle" style={{ paddingBottom: 20 }} >Friend Requests</h1>
            <div className='small-friends-container gray' >
              {this.state.friendRequests}

            </div>
          </div>
          <div style={{ paddingTop: 20 }}>
            <h1 className="large-card-text-middle" style={{ paddingBottom: 20 }}>Pending Friends </h1>
            <div className='small-friends-container gray'>
              {this.state.pendingRequests}
            </div>
          </div>

        </div>
      </div>
    );
  }
}
