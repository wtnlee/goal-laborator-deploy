import React from 'react';

import GoalCard from './GoalCard';
import './MyGoals.css';

export default class Explore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      general: [],
      wellness: [],
      hobby: []

    };
    this.getGeneralGoals = this.getGeneralGoals.bind(this);
    this.getHobbyGoals = this.getHobbyGoals.bind(this);
    this.getWellnessGoals = this.getWellnessGoals.bind(this);

    this.getGeneralGoals();
    this.getHobbyGoals();
    this.getWellnessGoals();
  }

  getGeneralGoals() {
    let requestBody = {
      query:
        `
          query{
            myExploreGeneralGoals{
              _id
              category
              title
              description
              completed
              creator{
                  name
              }
              title
              collaborators{
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
      if (arr.data) {
        //  console.log(arr);

        let contents = arr.data.myExploreGeneralGoals;
        let results = await contents.map((entry, i) => {
          console.log(entry);
          let emails = [];
          for (let i = 0; i < entry.collaborators.length; i++) {
            emails.push(entry.collaborators[i]['email']);
          }
          return <div key={i} style={{ paddingTop: 12.5, paddingBottom: 12.5, paddingLeft: 45, paddingRight: 45 }}>
            <GoalCard
              goalName={entry.title}
              goalText={entry.description}
              goalCategory={entry.category}
              goalID={entry._id}
              shouldDis = {true}
              creatorName={entry.creator.name}
              collaborators={emails}
              completed={entry.completed}
              //checkIns={entry.checkIns}
              button1="Collaborate"
              button2="" />
          </div>;
        });
        //console.log(results);
        this.setState({
          general: results
        });
      }
      else {
        console.log("You have no goals");
      }
    });
  }

  getHobbyGoals() {
    let requestBody = {
      query:
        `
          query {
            myExploreHobbyCreativeGoals{
              _id
              category
              title
              description
              completed
              creator{
                  name
              }
              title
              collaborators{
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
      if (arr.data) {
        // console.log(arr);
        let contents = arr.data.myExploreHobbyCreativeGoals;
        let results = await contents.map((entry, i) => {
          let emails = [];
          console.log(entry);

          for (let i = 0; i < entry.collaborators.length; i++) {
            emails.push(entry.collaborators[i]['email']);
          }
          return <div key={i} style={{ paddingTop: 12.5, paddingBottom: 12.5, paddingLeft: 45, paddingRight: 45 }}>
            <GoalCard
              goalName={entry.title}
              goalText={entry.description}
              goalCategory={entry.category}
              goalID={entry._id}
              creatorName={entry.creator.name}
              collaborators={emails}
              completed={entry.completed}
              shouldDis = {true}
              //checkIns={entry.checkIns}
              button1="Collaborate"
              button2="" />
          </div>;
        });
        //  console.log(results);
        this.setState({
          hobby: results
        });
      }
      else {
        console.log("You have no goals");
      }
    });
  }

  getWellnessGoals() {
    let requestBody = {
      query:
        `
          query{
            myExploreWellnessPhysicalGoals{
              _id
              category
              title
              description
              completed
              creator{
                  name
              }
              title
              collaborators{
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
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(async (arr) => {
      if (arr.data) {
        // console.log(arr);
        let contents = arr.data.myExploreWellnessPhysicalGoals;
        let results = await contents.map((entry, i) => {
          console.log(entry);
          let emails = [];
          for (let i = 0; i < entry.collaborators.length; i++) {
            emails.push(entry.collaborators[i]['email']);
          }
          return <div key={i} style={{ paddingTop: 12.5, paddingBottom: 12.5, paddingLeft: 45, paddingRight: 45 }}>
            <GoalCard
              goalName={entry.title}
              goalText={entry.description}
              goalCategory={entry.category}
              goalID={entry._id}
              collaboators={emails}
              creatorName={entry.creator.name}
              completed={entry.completed}
              shouldDis = {true}
              //checkIns={entry.checkIns}
              button1="Collaborate"
              button2="" />
          </div>;
        });
        console.log(results);
        this.setState({
          wellness: results
        });
      }
      else {
        console.log("You have no goals");
      }
    });
  }

  render() {
    return (
      <div style={{ paddingTop: 25, paddingLeft: 0, paddingRight: 25, display: 'flex', flexDirection: 'column' }}>
        <div style={{ paddingLeft: 25, paddingRight: 25, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <div className="header-column" style={{ paddingLeft: 0, }}>
            <h1 className="large-card-text-middle"> General Goals</h1>
          </div>
          <div className="header-column" style={{ paddingLeft: 0, }}>
            <h1 className="large-card-text-middle"> Wellness and Physical</h1>

          </div>
          <div className="header-column" style={{ paddingLeft: 0, }}>
            <h1 className="large-card-text-middle"> Hobbies and Creativity</h1>
          </div>
        </div>
        <div style={{ paddingTop: 25, paddingBottom: 25, paddingLeft: 25, paddingRight: 25, display: 'flex', flexDirection: 'row' }}>
          <div className='news-container-explore gray' >
            {this.state.general}
          </div>

          <div className='news-container-explore gray' >
            {this.state.wellness}
          </div>

          <div className='news-container-explore gray' >
            {this.state.hobby}
          </div>
        </div>
      </div>
    );
  }
}
