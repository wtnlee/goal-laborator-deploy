const Goal = require('../../models/goal.js');
 const User = require('../../models/user.js');
 const CheckIn = require('../../models/checkin.js');
var mongoose = require('mongoose');

const {transformGoal, transformCheckIn} = require('./merge')

module.exports = {
  createGoal: async (args, req) => {
    const goal = new Goal({
      category: args.goalInput.category.toUpperCase(),
      title: args.goalInput.title,
      description: args.goalInput.description,
      weeklyFrequency: +args.goalInput.weeklyFrequency,
      creator: req.session.userid,
      private: args.goalInput.private
    });

    let createdGoal;
    try {
      const result = await goal.save();
      createdGoal = transformGoal(result);

      // console.log(req.session.userid);
      const creator = await User.findById(req.session.userid);
      if (!creator) {
        throw new Error('User not found');
      }
      creator.createdGoals.push(goal);
      await creator.save();
      return createdGoal;
    } catch (err) {
      throw err;
    }
  },
  completeGoal: async (args, req) => {
    try {
      let goalId = mongoose.Types.ObjectId(args.goalId);
      let result = await Goal.findById(goalId);
      if (result.creater !== req.userId) {
        throw Error('User not authorized to complete goal');
      }

      result.completed = args.completedGoal;
      const savedGoal = await result.save();
      return transformGoal(savedGoal);
    } catch (err) {
      throw err;
    }
  },
  collaborateOnGoal: async (args, req) => {
    try {
      let goalId = mongoose.Types.ObjectId(args.goalId);
      const result = await Goal.findById(goalId);
      if (result.creater === req.session.userid) {
        throw Error('creator cant collaborate on goal');
      }

      if (result.private) {
        throw Error('cant collaborate on private goal');
      }

      const collaborator = await User.findById(req.session.userid);

      if (!collaborator) {
        throw Error('cant find collaborator');
      }

      result.collaborators.push(collaborator);
      await result.save();

      collaborator.collaboratedGoals.push(result);
      await collaborator.save();

      return transformGoal(result);
    } catch (err) {
      throw err;
    }
   },
  // getNewsFeed: async (args, req) => {
  //   try {
  //     const user = await User.findById(req.userId);
  //     const friendGoals = [];
  //     for (var friendId in user.friends) {
  //       const friend = await User.findById(args.friendId);
  //       for (var goalId in friend.createdGoals) {
  //         const goal = await Goal.findById(goalId);
  //         friendGoals.push(transformGoal(goal));
  //       }
  //       for (var goalId in friend.collaboratedGoals) {
  //         const goal = await Goal.findById(goalId);
  //         friendGoals.push(transformGoal(goal));
  //       }
  //     }
  //
  //     friendGoals.sort(function(a, b) {
  //       var d1 = new Date(a.dateCreated);
  //       var d2 = new Date(b.dateCreated);
  //       return d1 <= d2;
  //     });
  //
  //     return friendsGoals;
  //   } catch (err) {
  //     throw (err);
  //   }
  // },
  goalCheckIn: async (args, req) => {
    try {
      let goalId = mongoose.Types.ObjectId(args.goalId);
      const result = await Goal.findById(goalId);
      // console.log(req.session.userid);
      const collaborator = await User.findById(req.session.userid);

      if (!collaborator) {
        throw Error('cant find user');
      }

      let weightedPoints = 1;
      if (!result.private) {
        weightedPoints = 2;
      }

      const checkin = new CheckIn({
        points: weightedPoints
      });

      checkin.checkInGoal = goalId;
      checkin.checkInUser = req.session.userid;
      const savedCheckIn = await checkin.save();

      collaborator.checkIns.push(checkin);
      await collaborator.save();

      result.checkIns.push(checkin);
      await result.save();

      return transformCheckIn(savedCheckIn);
    } catch (err) {
      throw err;
    }
  },
  likeGoal: async (args, req) => {
    try {
      const collaborator = await User.findById(req.session.userid);
      if (!collaborator) {
        throw Error('cant find collaborator');
      }

      let goalId = mongoose.Types.ObjectId(args.goalId);
      const result = await Goal.findById(goalId);

      result.likes.push(collaborator);

      await result.save();

      return transformGoal(result);
    } catch (err) {
      throw err;
    }
  },
  myDashboardCreatedGoals: async (args, req) => {
      try {
        const user = await User.findById(req.session.userid);
        if (!user) {
          throw Error('cant find user');
        }

        let myDashBoardGoals = [];

        for (let i = 0; i < user.createdGoals.length; i++) {
          goalID = user.createdGoals[i];
          let thisObject = {}
          let thisGoal = await Goal.findById(goalID);
         // console.log(thisGoal);

          let queryParams = {
            checkInUser: mongoose.Types.ObjectId(req.session.userid),
            checkInGoal: mongoose.Types.ObjectId(goalID)
          }

          let thisGoalCheckIns= [];
          let pastWeekCheckIns = [];
        

          let x = await CheckIn.find(queryParams).then(checkIns => {
           // console.log(queryParams.checkInGoal);
           // console.log(thisGoal.title);
           // console.log(checkIns);
            for (let j = 0; j <checkIns.length; j++) {
                    //console.log(checkIns[j]);
                    thisGoalCheckIns.push(checkIns[j]);
                  }
          });
         // console.log("AFTER ASYNC");

          let pastDate = new Date(Date.now() - 604800000);
          const today = new Date();
          let shouldCheckIn = true;

          for (let j = 0; j < thisGoalCheckIns.length; j++) {

            let checkIn = thisGoalCheckIns[j];
            let thisCheckInDate = new Date(checkIn.dateOfCheckIn);

            if (thisCheckInDate > pastDate) {
              pastWeekCheckIns.push(thisCheckInDate.toISOString());
            }

            shouldCheckIn = !(thisCheckInDate.getDate() === today.getDate() && thisCheckInDate.getMonth() === today.getMonth() && thisCheckInDate.getFullYear() === today.getFullYear());
          }

         

          thisObject.goal = transformGoal(thisGoal);
          if (thisObject.goal.completed) {
            shouldCheckIn = false;
          }
          thisObject.shouldCheckIn = shouldCheckIn;
          thisObject.checkIns = pastWeekCheckIns;
          myDashBoardGoals.push(thisObject);
        }

        myDashBoardGoals.sort(function(a,b) {
          if(a.shouldCheckIn){
            return -1;
          }
          if(b.shouldCheckIn){
            return 1;
          }
          if(a.goal.completed){
            return -1;
          }
          if(b.goal.completed){
            return -1;
          }
          return 1;
          // if (a.goal.completed && !b.goal.completed) {
          //   return 1;
          // }
          // if (!a.goal.completed && b.goal.completed) {
          //   return -1;
          // }
          // if (a.shouldCheckIn && b.goal.completed) {
          //   return -1;
          // }
          // if (b.shouldCheckIn && a.goal.completed) {
          //   return -1;
          // }
          // return 0;
        });

        return myDashBoardGoals;
      } catch (err) {
        throw err;
      }
  },
  myDashboardCollaboratedGoals: async (args, req) => {
    try {
      let user1 = await User.findById(req.session.userid);
      if (!user1) {
        throw Error('cant find user');
      }

      let myDashBoardGoals1 = [];

      for (let i = 0; i < user1.collaboratedGoals.length; i++) {
        goalID1 = user1.collaboratedGoals[i];
        let thisObject1 = {}
        let thisGoal1 = await Goal.findById(goalID1);

        let queryParams1 = {
          checkInUser: mongoose.Types.ObjectId(req.session.userid),
          checkInGoal: mongoose.Types.ObjectId(goalID1)
        }

        let thisGoalCheckIns1= [];
        let pastWeekCheckIns1 = [];

        let test1 = await CheckIn.find(queryParams1).then(checkIns1 => {
          for (let j = 0; j <checkIns1.length; j++) {
            thisGoalCheckIns1.push(checkIns1[j]);
          }
        });

        let pastDate = new Date(Date.now() - 604800000);

        const today = new Date();

        let shouldCheckIn1 = true;

        for (let j = 0; j < thisGoalCheckIns1.length; j++) {
          let checkIn1 = thisGoalCheckIns1[j];
          let thisCheckInDate1 = new Date(checkIn1.dateOfCheckIn);

          if (thisCheckInDate1 > pastDate) {
            pastWeekCheckIns1.push(thisCheckInDate1.toISOString());
          }

          shouldCheckIn1 = !(thisCheckInDate1.getDate() === today.getDate() && thisCheckInDate1.getMonth() === today.getMonth() && thisCheckInDate1.getFullYear() === today.getFullYear());
        }


        thisObject1.goal = transformGoal(thisGoal1);

        if (thisObject1.goal.completed) {
          shouldCheckIn = false;
        }
        thisObject1.shouldCheckIn = shouldCheckIn1;
        thisObject1.checkIns = pastWeekCheckIns1;
        myDashBoardGoals1.push(thisObject1);
      }

      myDashBoardGoals1.sort(function(a,b) {
        if(a.shouldCheckIn){
          return -1;
        }
        if(b.shouldCheckIn){
          return 1;
        }
        if(a.goal.completed){
          return -1;
        }
        if(b.goal.completed){
          return -1;
        }
        return 1;
      });

      return myDashBoardGoals1;
    } catch (err) {
      throw err;
    }
  },
  myExploreGeneralGoals : async (args, req) => {
    try {
      const user4 = await User.findById(req.session.userid);
      if (!user4) {
        throw Error('cant find user');
      }

      let allPublicGoals4 = [];

      // let queryParams4 = {
      //   checkInUser: mongoose.Types.ObjectId(req.session.userid),
      //   checkInGoal: mongoose.Types.ObjectId(goalID)
      // }

      for (let i = 0; i < user4.friends.length; i++) {
        let friendId4 = user4.friends[i];

        let queryParams4 = {
          category: "GENERAL",
          private: false,
          creator: mongoose.Types.ObjectId(friendId4),
          completed: false
        }

        await Goal.find(queryParams4).then(goals4 => {
          for (let j = 0; j < goals4.length; j++) {
            let currentGoal4 = goals4[j];
            currentGoal4.dateCreated = (new Date(currentGoal4.dateCreated)).toISOString;
            if (!currentGoal4.collaborators.includes(req.session.userid)) {
              allPublicGoals4.push(transformGoal(currentGoal4));
            }
          }
        });
      }

      allPublicGoals4.sort(function(a,b) {
        let aDate = new Date(a.dateCreated);
        let bDate = new Date(b.dateCreated);

        if (aDate > bDate) {
          return -1;
        }
        return 1;
      });

      return allPublicGoals4;
    } catch (err) {
      throw err;
    }
  },
  myExploreWellnessPhysicalGoals : async (args, req) => {
    try {
      const user = await User.findById(req.session.userid);
      if (!user) {
        throw Error('cant find user');
      }

      let allPublicGoals = [];

      let queryParams = {
        checkInUser: mongoose.Types.ObjectId(req.session.userid),
        checkInGoal: mongoose.Types.ObjectId(goalID)
      }

      for (let i = 0; i < user.friends.length; i++) {
        let friendId = user.friends[i];

        let queryWellnessParam = {
          category: "WELLNESS",
          private: false,
          creator: mongoose.Types.ObjectId(friendId),
          completed: false
        }

        await Goal.find(queryWellnessParam).then(goals => {
          for (let j = 0; j < goals.length; j++) {
            let currentGoal = goals[j];
            currentGoal.dateCreated = (new Date(currentGoal.dateCreated)).toISOString;
            if (!currentGoal.collaborators.includes(req.session.userid)) {
              allPublicGoals.push(transformGoal(currentGoal));
            }
          }
        });

        let queryPhysicalParam = {
          category: "PHYSICAL",
          private: false,
          creator: mongoose.Types.ObjectId(friendId),
          completed: false
        }

        await Goal.find(queryPhysicalParam).then(goals => {
          for (let j = 0; j < goals.length; j++) {
            let currentGoal = goals[j];
            currentGoal.dateCreated = (new Date(currentGoal.dateCreated)).toISOString;
            if (!currentGoal.collaborators.includes(req.session.userid)) {
              allPublicGoals.push(transformGoal(currentGoal));
            }
          }
        });

        let queryDietParam = {
          category: "DIET",
          private: false,
          creator: mongoose.Types.ObjectId(friendId),
          completed: false
        }

        let test = await Goal.find(queryDietParam).then(goals => {
          for (let j = 0; j < goals.length; j++) {
            let currentGoal = goals[j];
            currentGoal.dateCreated = (new Date(currentGoal.dateCreated)).toISOString;
            if (!currentGoal.collaborators.includes(req.session.userid)) {
              allPublicGoals.push(transformGoal(currentGoal));
            }
          }
        });
      }

      allPublicGoals.sort(function(a,b) {
        let aDate = new Date(a.dateCreated);
        let bDate = new Date(b.dateCreated);

        if (aDate > bDate) {
          return -1;
        }
        return 1;
      });

      return allPublicGoals;
    } catch (err) {
      throw err;
    }
  },
  myExploreHobbyCreativeGoals : async (args, req) => {
    try {
      const user1 = await User.findById(req.session.userid);
      if (!user1) {
        throw Error('cant find user');
      }

      let allPublicGoals1 = [];

      // let queryParams1 = {
      //   checkInUser: mongoose.Types.ObjectId(req.session.userid),
      //   checkInGoal: mongoose.Types.ObjectId(goalID)
      // }

      for (let i = 0; i < user1.friends.length; i++) {
        let friendId1 = user1.friends[i];

        let queryHobbyParams1 = {
          category: "HOBBY",
          private: false,
          creator: mongoose.Types.ObjectId(friendId1),
          completed: false
        }

        let x10 = await Goal.find(queryHobbyParams1).then(goals1 => {
          for (let j = 0; j < goals1.length; j++) {
            let currentGoal1 = goals1[j];
            currentGoal1.dateCreated = (new Date(currentGoal1.dateCreated)).toISOString;
            if (!currentGoal1.collaborators.includes(req.session.userid)) {
              allPublicGoals1.push(transformGoal(currentGoal1));
            }
          }
        });

        let queryCreativeParams1 = {
          category: "CREATIVE",
          private: false,
          creator: mongoose.Types.ObjectId(friendId1),
          completed: false
        }

        let test10 = await Goal.find(queryCreativeParams1).then(goals2 => {
          for (let j = 0; j < goals2.length; j++) {
            let currentGoal2 = goals2[j];
            currentGoal2.dateCreated = (new Date(currentGoal2.dateCreated)).toISOString;
            if (!currentGoal2.collaborators.includes(req.session.userid)) {
              allPublicGoals1.push(transformGoal(currentGoal2));
            }
          }
        });
      }

      allPublicGoals1.sort(function(a,b) {
        let aDate = new Date(a.dateCreated);
        let bDate = new Date(b.dateCreated);

        if (aDate > bDate) {
          return -1;
        }
        return 1;
      });

      return allPublicGoals1;
    } catch (err) {
      throw err;
    }
  }
}

// explore page queries
