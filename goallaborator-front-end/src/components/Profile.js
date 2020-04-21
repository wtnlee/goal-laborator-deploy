import React, { Component } from 'react';
import { Card, Button, CardTitle, CardText, CardImg, Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import './Profile.css';
import './MyGoals.css';
import { Grid } from "@material-ui/core";
import GoalCard from './GoalCard.js';
import SearchBar from './SearchBar';

var i = 0;

/*
 * Left:
 * Search box: To navigate to other people’s pages
 * 
 * Picture
 * Profile Information (name, email, points)
 * Add or Delete friend buttons
 * 
 * Friends List Component - Name + points
 * 
 * Right:
 * Goal Bounding Box - Text Relating to the goal
 */

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      me: true,
      friend: false,
      friendRequestAlreadySent: false,
      friendRequestReceived: false,
      img: "https://i.imgflip.com/2ybaqz.jpg",
      myEmail: "",
      myCreatedGoals: [],
      myCollaboratedGoals: [],
      myFriendList: [],
      myFriendRequests: [],
      myPendingRequests: [],

      options: [],
      query: "",
      inputValue: "",

      _id: "",
      name: "",
      email: "",
      points: 0,
      userId: "",

      friendList: [],
      createdGoals: [],
      collaboratedGoals: [],
    };

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.getNewOptions = this.getNewOptions.bind(this);
    this.submitQuery = this.submitQuery.bind(this);

    this.titleCase = this.titleCase.bind(this);
    this.getFriendDivs = this.getFriendDivs.bind(this);
    this.getPoints = this.getPoints.bind(this);
    this.getProfileImage = this.getProfileImage.bind(this);

    this.processGoals = this.processGoals.bind(this);
    this.getGoalsDivs = this.getGoalsDivs.bind(this);

    this.checkFriend = this.checkFriend.bind(this);
    this.addFriend = this.addFriend.bind(this);
    this.updateFriendList = this.updateFriendList.bind(this);
    this.removeFriend = this.removeFriend.bind(this);
    this.acceptFriend = this.acceptFriend.bind(this);
    this.updateFriendList = this.updateFriendList.bind(this);

    this.getFriendButton = this.getFriendButton.bind(this);
  }

  /**
   * Changes the name string to proper titlecase format
   * @param {name} str 
   */
  titleCase(str) {
    let splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  /**
   * Loads user data upon profile click
   */
  componentDidMount() {
    let requestBody = {
      query:
        `
          query {
            me {
              _id
              email
              name
              friends {
                _id
                name
                email
              }
              friendRequests {
                _id
                email
                name
              }
              pendingRequests{
                _id
                email
                name
              }
              createdGoals {
                _id
                category
                title
                description
                weeklyFrequency
                private
                completed
                creator {
                  email
                }
                collaborators {
                  name
                  email
                }
                checkIns {
                  user {
                    email
                    name
                  }
                  date
                  points
                }
              }
              collaboratedGoals {
                _id
                category
                title
                description
                weeklyFrequency
                private
                completed
                creator {
                  email
                }
                collaborators {
                  name
                  email
                }
                checkIns {
                  user {
                    email
                    name
                  }
                  date
                  points
                }
              }
            }
          }
        `
    };

    // Make the fetch request and update the state
    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        this.getProfileImage();
        this.setState({
          myEmail: resData.data.me.email,
          myCreatedGoals: resData.data.me.createdGoals,
          myCollaboratedGoals: resData.data.me.collaboratedGoals,
          myFriendList: resData.data.me.friends,
          myFriendRequests: resData.data.me.friendRequests,
          myPendingRequests: resData.data.me.pendingRequests,

          _id: resData.data.me._id,
          name: resData.data.me.name,
          email: resData.data.me.email,
          userId: resData.data.me._id,
          createdGoals: resData.data.me.createdGoals,
          collaboratedGoals: resData.data.me.collaboratedGoals,
          friendList: resData.data.me.friends
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  /**
   * Makes a list of <ListGroupItem> to display the friend's names
   * @param {array of friends} friendList 
   */
  getFriendDivs(friendList) {
    let divs = [];
    friendList.map((friendObj, i) => divs.push(
      <ListGroupItem key={friendObj.email}>{friendObj.name}</ListGroupItem>)
    );
    return divs;
  }

  /**
   * Processes goals for the goal card
   * Assumption for input: Only takes in public goals of friends
   * 
   * @param {array of goals} goalsToShow 
   */
  processGoals(goalsArr) {
    let result = [];

    // Get my goal IDs for the "Collaborate" button
    let myGoalIds = [];
    if (!this.state.me) {
      let myGoals = this.state.myCreatedGoals.concat(this.state.myCollaboratedGoals);
      myGoals.map((goalObj, i) => myGoalIds.push(goalObj._id));
    }

    for (let i = 0; i < goalsArr.length; i++) {
      console.log(goalsArr[i]);
      let currGoal = {};
      currGoal["title"] = goalsArr[i]["title"];
      currGoal["description"] = goalsArr[i]["description"];
      currGoal["category"] = goalsArr[i]["category"];
      currGoal["_id"] = goalsArr[i]["_id"];

      currGoal["collaborators"] = [];
      goalsArr[i]["collaborators"].map((goalObj, i) => currGoal["collaborators"].push(goalObj.email));

      currGoal["checkIns"] = [];
      goalsArr[i]["checkIns"].map((goalObj, i) => currGoal["checkIns"].push(goalObj.date));

      // If it's not my page and I'm not collaborating in the goal 
      // then show the button to collaborate
      if (this.state.me) {
        currGoal["button1"] = "";
      } else if (!this.state.friend) {
        currGoal["button1"] = "";
      } else if (goalsArr[i]["completed"] || myGoalIds.includes(goalsArr[i]["_id"])) {
        currGoal["button1"] = "";
      } else {
        currGoal["button1"] = "Collaborate";
      }

      result.push(currGoal);
    }
    return result;
  }

  /**
   * Makes a list of <ListGroupItem> to display the friend's names
   * @param {array of friends} friendList 
   */
  getGoalsDivs(createdGoals, collaboratedGoals) {
    let allGoals = createdGoals.concat(collaboratedGoals);
    let goalsToShow = [];

    // only show private goals
    if (!this.state.me) {
      for (let i = 0; i < allGoals.length; i++) {
        if (!allGoals[i].private) {
          goalsToShow.push(allGoals[i]);
        }
      }
    } else {
      goalsToShow = allGoals;
    }

    let processedGoals = this.processGoals(goalsToShow);

    // map and return divs
    let divs = [];
    processedGoals.map((goalObj, i) => divs.push(
      <div key={goalObj._id} style={{ paddingTop: 12.5, paddingBottom: 12.5, paddingLeft: 80, paddingRight: 80 }}>
        <GoalCard
          key={goalObj._id}

          goalName={goalObj.title}
          goalText={goalObj.description}
          goalCategory={goalObj.category}
          goalID={goalObj._id}
          shouldDis = {false}

          collaborators={goalObj.collaborators} // an array of email strings
          checkIns={goalObj.checkIns} // array of isostrings
          button1={goalObj.button1} // "Collaborate" only when we can collaborate
          button2=""
        />
      </div>)
    );
    return divs;
  }

  /**
   * Adds up all the points from the check-ins
   * @param {goal objects} allGoals 
   */
  getPoints(allGoals) {
    let totalPoints = 0;
    let allCheckIns = [];
    allGoals.map((goalObj, i) => allCheckIns.push(goalObj.checkIns));
    // no checkins
    if (allCheckIns.length === 0) {
      return 0;
    } else {
      allCheckIns.map((checkInObj, i) => checkInObj.length > 0 ? totalPoints += checkInObj[0].points : totalPoints += 0);
      return totalPoints;
    }
  }

  /**
   * Add friend
   */
  addFriend() {
    let requestBody = {
      query:
        `
          mutation {
            sendFriendRequest(friendId: "${this.state._id}")
          }
        `
    };

    // Make the mutation request and update the state
    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({
          friend: false,
          friendRequestAlreadySent: true,
          friendRequestReceived: false,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  /**
   * Update the myFriendList of the state for the profile page
   * when the friend request is accepted
   * @param {userId} friendId 
   */
  updateFriendList(friendId) {
    let requestBody = {
      query:
        `
          query {
            getFriend(friendId : "${friendId}") {
              _id
              email
              name
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
    }).then(resData => {
      let olderFriends = this.state.myFriendList;
      olderFriends.push(resData.data.getFriend);
      this.setState({ myFriendList: olderFriends, friend: true });
    }).catch(err => {
      console.log(err);
    });
  }

  /**
   * Accept a friend request of a user
   * @param {userId} friendId 
   */
  acceptFriend(friendId) {
    let requestBody = {
      query:
        `
          mutation {
            updateFriendRequest(friendId : "${friendId}", accepted : ${true})
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
        // remove from my requests
        let prevRequests = this.state.myFriendRequests;
        let newRequests = [];
        prevRequests.map((friendObj, i) => friendObj._id === friendId ? null : newRequests.push(friendObj));
        this.setState({ myFriendList: newRequests, friend: true });
        // update the friend list
        this.updateFriendList(friendId);
        // update the buttons
        this.setState({ friend: true, friendRequestAlreadySent: false, friendRequestReceived: false });
      }
    });
  }

  /**
   * Reject a friend request that I already have
   * @param {userId} friendId 
   */
  rejectFriend(friendId) {
    let requestBody = {
      query:
        `
        mutation {
          updateFriendRequest(friendId : "${friendId}", accepted : ${false})
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
        // remove from my requests
        let prevRequests = this.state.myFriendRequests;
        let newRequests = [];
        prevRequests.map((friendObj, i) => friendObj._id === friendId ? null : newRequests.push(friendObj));
        this.setState({ myFriendList: newRequests, friend: true });
        // update the buttons
        this.setState({ friend: false, friendRequestAlreadySent: false, friendRequestReceived: false });
      }
    });
  }

  /**
   * Remove friend from friends
   */
  removeFriend() {
    let requestBody = {
      query:
        `
          mutation {
            removeFriend(friendId: "${this.state._id}") 
          }
        `
    };

    // Make the mutation request and update the state
    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        let olderFriends = this.state.myFriendList;
        let newFriends = [];
        olderFriends.map((friendObj, i) => friendObj._id === this.state._id ? null : newFriends.push(friendObj));
        this.setState({
          myFriendList: newFriends,
          friend: false,
          friendRequestAlreadySent: false,
          friendRequestReceived: false,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  /**
   * Checks if a user is person's friend, if they have to accept/reject friend
   * request, or if they have already sent a request
   * @param {userId} friendId 
   */
  checkFriend(friendId) {
    let allFriendIds = [];
    this.state.myFriendList.map((friendObj, i) => allFriendIds.push(friendObj._id));
    if (allFriendIds.includes(friendId)) {
      this.setState({ friend: true, friendRequestReceived: true, friendRequestAlreadySent: false });
      return;
    }

    let allReceivedRequestIds = [];
    this.state.myFriendRequests.map((friendObj, i) => allReceivedRequestIds.push(friendObj._id));
    if (allReceivedRequestIds.includes(friendId)) {
      this.setState({ friend: false, friendRequestReceived: true, friendRequestAlreadySent: false });
      return;
    }

    let allPendingRequestIds = [];
    this.state.myPendingRequests.map((friendObj, i) => allPendingRequestIds.push(friendObj._id));
    if (allPendingRequestIds.includes(friendId)) {
      this.setState({ friend: false, friendRequestReceived: false, friendRequestAlreadySent: true });
      return;
    }
  }

  submitQuery() {
    console.log("submitted a query for " + this.state.query);

    let emailToSearch = this.state.query;
    let requestBody = {};

    if (emailToSearch.toLowerCase() === this.state.myEmail.toLowerCase()) {
      requestBody = {
        query:
          `
            query {
              me {
                _id
                email
                name
                friends {
                  _id
                  name
                  email
                }
                createdGoals {
                  _id
                  category
                  title
                  description
                  weeklyFrequency
                  private
                  completed
                  creator {
                    email
                  }
                  collaborators {
                    name
                    email
                  }
                  checkIns {
                    user {
                      email
                      name
                    }
                    date
                    points
                  }
                }
                collaboratedGoals {
                  _id
                  category
                  title
                  completed
                  description
                  weeklyFrequency
                  private
                  creator {
                    email
                  }
                  collaborators {
                    name
                    email
                  }
                  checkIns {
                    user {
                      email
                      name
                    }
                    date
                    points
                  }
                }
              }
            }
          `
      };
    } else {
      requestBody = {
        query:
          `
            query {
              userByEmail(email: "${emailToSearch}") {
                _id
                email
                name
                friends {
                  _id
                  name
                  email
                }
                createdGoals {
                  _id
                  category
                  title
                  description
                  weeklyFrequency
                  private
                  completed
                  creator {
                    email
                  }
                  collaborators {
                    name
                    email
                  }
                  checkIns {
                    user {
                      email
                      name
                    }
                    date
                    points
                  }
                }
                collaboratedGoals {
                  _id
                  category
                  title
                  description
                  weeklyFrequency
                  completed
                  private
                  creator {
                    email
                  }
                  collaborators {
                    name
                    email
                  }
                  checkIns {
                    user {
                      email
                      name
                    }
                    date
                    points
                  }
                }
              }
            }
          `
      };
    }

    // Make the fetch request and update the state
    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        if (resData.data.me) {
          resData.data.userByEmail = resData.data.me;
          this.setState({ me: true, friend: false });
        } else {
          this.setState({ me: false });
        }

        this.checkFriend(resData.data.userByEmail._id);

        this.getProfileImage();

        this.setState({
          _id: resData.data.userByEmail._id,
          name: resData.data.userByEmail.name,
          email: resData.data.userByEmail.email,
          createdGoals: resData.data.userByEmail.createdGoals,
          collaboratedGoals: resData.data.userByEmail.collaboratedGoals,
          friendList: resData.data.userByEmail.friends,
          userId: resData.data.userByEmail._id,

          options: [""],
          query: "",
          value: "",
          inputValue: ""
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleQueryChange = (event, values) => {
    this.setState({
      query: values
    });
  }

  handleInputChange = (event, values) => {
    this.setState({
      inputValue: values
    });
  }

  getNewOptions(e) {
    var sol = e.target.value;
    if (e.target.value.trim().length < 2) {
      i = 0;
      this.setState({
        players: [""]
      });
      return;
    }
    if (i % 3 === 0) {
      i++;
      return;
    }
    i = 0;
    this.setState({
      input: e.target.value
    });

    fetch("/searchQuery/" + sol,
      {
        method: 'GET' // The type of HTTP request.
      }).then(res => {
        // Convert the response data to a JSON.
        return res.json();
      }, err => {
        // Print the error if there is one.
        console.log(err);
      }).then(arr => {
        if (!arr) return;
        arr.push("");
        this.setState({
          options: arr
        });
      });
  }

  /**
   * Get a random profile image
   */
  getProfileImage() {
    if (this.state.me) {
      this.setState({ img: "https://i.imgflip.com/2ybaqz.jpg" });
      return;
    }

    let r = Math.random();
    if (r < 0.2) {
      // potato
      this.setState({ img: "https://www.pngitem.com/pimgs/m/428-4281713_cute-potato-cutepotato-love-you-wholesome-meme-hd.png" });
    } else if (r < 0.4) {
      // phineas
      this.setState({ img: "https://i.pinimg.com/600x315/a0/f0/ac/a0f0ace56626516c33c25ce96cad0156.jpg" });
    } else if (r < 0.6) {
      // isabelle
      this.setState({ img: "https://i.redd.it/l35v47at80a41.jpg" });
    } else if (r < 0.8) {
      // pikachu
      this.setState({ img: "https://secure.img1-ag.wfcdn.com/im/98270403/resize-h800-w800%5Ecompr-r85/8470/84707680/Pokemon+Pikachu+Wall+Decal.jpg" });
    } else {
      // kirby
      this.setState({ img: "https://i.imgflip.com/2ybaqz.jpg" });
    }
  }

  /**
   * Return the appropriate buttons for the friend
   */
  getFriendButton() {
    if (this.state.me) {
      return <br />;
    } else if (this.state.friend) {
      return <Button onClick={this.removeFriend} color="danger"> Remove friend </Button>;
    } else if (this.state.friendRequestReceived) {
      return <Grid container justify="space-between">
        <Grid item style={{ paddingLeft: 30 }}>
          <Button onClick={() => this.acceptFriend(this.state._id)} color="primary"> Accept friend </Button>
        </Grid>
        <Grid item style={{ paddingRight: 30 }}>
          <Button onClick={() => this.rejectFriend(this.state._id)} color="danger"> Reject friend </Button>
        </Grid>
      </Grid>;
    } else if (this.state.friendRequestAlreadySent) {
      return <Button disabled={true} onClick={this.addFriend} color="primary"> Add friend </Button>;
    } else {
      return <Button onClick={this.addFriend} color="primary"> Add friend </Button>;
    }
  }

  render() {
    return (
      <div style={{ paddingTop: 25 }}>
        <Container>
          <Row lg={2} md={2}>
            <Col sm={1} md={1} style={{ paddingRight: '200px' }}>
              <div className='profile-left-flex'>
                <Row>
                  <div style={{ height: "10px" }} />
                </Row>
                <Row>
                  <Card body style={{ backgroundColor: "#e9ecef", borderColor: "#e9ecef" }}>
                    <CardImg className="card-img-top" top src={this.state.img} alt="Card image cap" />
                    <CardTitle style={{ "fontSize": "1.9vw" }}> {this.titleCase(this.state.name)} </CardTitle>
                    <CardText> {this.state.email} </CardText>
                    <CardText> {this.getPoints(this.state.createdGoals.concat(this.state.collaboratedGoals))} </CardText>
                    {this.getFriendButton()}
                  </Card>
                </Row>
                <Row>
                  <div style={{ height: "15px" }} />
                </Row>
                <Row>
                  <Card body style={{ backgroundColor: "#e9ecef", borderColor: "#e9ecef" }}>
                    <div>
                      <SearchBar
                        options={this.state.options} handleQueryChange={this.handleQueryChange}
                        getNewOptions={this.getNewOptions} labelText="Search for a Friend's Email"
                        value={this.state.query} inputValue={this.state.inputValue}
                        handleInputChange={this.handleInputChange}
                      />
                      <Button id="submitQueryBtn" color="primary" onClick={this.submitQuery} style={{ width: 350, height: 45, fontSize: 16, fontWeight: 600 }}>
                        Search
                      </Button>
                      <br />
                    </div>
                  </Card>
                </Row>
                <Row>
                  <div style={{ height: "20px" }} />
                </Row>
                <Row>
                  <div className="flex-container-title">
                    <h1 className="large-card-text-middle">Friend List</h1>
                  </div>
                </Row>
                <Row>
                  <div className="scroll-friend">
                    <Card body style={{ backgroundColor: "#e9ecef", borderColor: "#e9ecef" }}>
                      <ListGroup>
                        {this.getFriendDivs(this.state.friendList)}
                      </ListGroup>
                    </Card>
                  </div>
                </Row>
              </div>
            </Col>
            <Col md={{ size: 'auto' }}>
              <Row>
                <div className="flex-container-title">
                  {this.state.me ? <h1 className="large-card-text-middle">My Goals</h1> : <h1 className="large-card-text-middle">{this.titleCase(this.state.name)}'s Goals</h1>}
                </div>
              </Row>
              <Row>
                <div style={{ height: "20px" }} />
              </Row>
              <Row>
                <div style={{ width: '100%' }} className="news-container gray">
                  {this.getGoalsDivs(this.state.createdGoals, this.state.collaboratedGoals)}
                </div>
              </Row>
              <Row>
                <div style={{ height: "20px" }} />
              </Row>
              <Row>
                <div style={{ height: "20px" }} />
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
