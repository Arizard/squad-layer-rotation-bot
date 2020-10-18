const defaultOptions = {
  layers: [],
  votingDurationSeconds: 20,
  layerchangeDurationSeconds: 5,
  onAnnouncement: function (message) {
    console.log(`[LayerRotationBot] ${message}`)
  },
  onPrivateMessage: function (playerID, message) {
    console.log(`[LayerRotationBot to ${playerID}] ${message}`)
  },
};

const states = {
  preVoting: {
    updateVote(self, playerID, layerName) {
      console.log("Can't vote in state preVoting.")
    },
  },
  voting: {
    updateVote(self, playerID, layerName) {

    },
  },
  postVoting: {
    updateVote(self, playerID, layerName) {
      console.log("Can't vote in state postVoting.")
    },
  },
};

export default class LayerRotationBot {

  options = defaultOptions;
  state = states.preVoting;
  timeout = null;
  resolveVoting = (...args) => {
  };
  rejectVoting = (...args) => {
  };

  constructor(options) {
    this.options = {...this.options, ...options};
    this.state.enter();
  }

  startVoting() {
    this.options.onAnnouncement("Voting started.");
    return new Promise((resolve, reject) => {
      this.resolveVoting = resolve;
      this.rejectVoting = reject;
    })
  }

  cancelVoting() {
    this.options.onAnnouncement("Voting cancelled.");
    this.rejectVoting("voting stopped manually");
  }

  finishVoting() {
    this.options.onAnnouncement("Voting finished.");
    this.resolveVoting("TODO -- WINNING_MAP_NAME");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("changing map now");
      }, this.options.layerchangeDurationSeconds * 1000);
    })
  }

  updateVote(...args) {
    return this.state.updateVote(this, ...args);
  }
}
