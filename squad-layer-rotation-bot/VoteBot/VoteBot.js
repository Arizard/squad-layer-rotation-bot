const defaultOptions = {
  choices: [],
  votingDurationSeconds: 20,
  onAnnouncement: function (message) {
    console.log(`[] ${message}`)
  },
  onPrivateMessage: function (userID, message) {
    console.log(`[] to ${userID}] ${message}`)
  },
  onVotingFinished: function(winner) {
    console.log(`[] winner ${winner}`)
  }
};

const states = {
  preVoting: {
    name: "preVoting",
    updateVote() {
      console.log("Can't vote in state preVoting.")
    },
    enter(self){},
    exit(self){},
  },
  voting: {
    name: "voting",
    updateVote(self, userId, choiceNumber) {
      if (choiceNumber > self.options.choices.length) {
        return
      }
      console.log(`${userId} voted for ${choiceNumber}`);

      self.votes[userId] = choiceNumber;
      console.log(self.votes);
    },
    enter(self){
    },
    exit(self){},
  },
  postVoting: {
    name: "postVoting",
    updateVote(self) {
      console.log("Can't vote in state postVoting.")
    },
    enter(self){},
    exit(self){},
  },
};

class VoteBot {

  options = defaultOptions;
  state = states.preVoting;
  votingTimeout = null;
  resolveVoting = (...args) => {
  };
  rejectVoting = (...args) => {
  };
  votes = {};

  constructor(options) {
    this.options = {...this.options, ...options};
    this.state.enter();
    this.logState();
  }

  logState() {
    console.log(`entered state ${this.state.name}`);
  }

  startVoting() {
    this.state = states.voting;
    this.logState();

    this.options.onAnnouncement("Voting started.");
    this.options.choices.map((option, index) => {
      this.options.onAnnouncement(`${index + 1}. ${option.name}`);
    });

    this.votingTimeout = setTimeout(() => {
      this.finishVoting()
    }, this.options.votingDurationSeconds * 1000);
  }

  cancelVoting() {
    this.state = states.preVoting;
    this.logState();

    this.options.onAnnouncement("Voting cancelled.");

    clearTimeout(this.votingTimeout);
  }

  finishVoting() {
    this.state = states.postVoting;
    this.logState();
    const totals = Object.values(this.votes).reduce((acc, val) => {
      if (acc.has(val)) {
        acc.set(val, acc.get(val) + 1);
      } else {
        acc.set(val, 1);
      }
      return acc
    }, new Map());

    let highest = 0;
    let winner = null;

    totals.forEach((votes, choiceNumber) => {
      if (votes >= highest) {
        highest = votes;
        winner = this.options.choices[choiceNumber - 1];
      }
    });

    this.options.onAnnouncement("Voting finished.");
    if (winner !== null) {
      this.options.onVotingFinished({name: winner.name});
    }
  }

  updateVote(...args) {
    return this.state.updateVote(this, ...args);
  }
}

module.exports = VoteBot;
