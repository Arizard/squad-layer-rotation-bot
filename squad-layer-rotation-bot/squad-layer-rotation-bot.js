import allLayers from './layers/layers.js';
import pluginConfig from './config.js';
import VoteBot from './VoteBot/VoteBot';
import CommandDispatcher from './CommandDispatcher/CommandDispatcher';
import {CHAT_MESSAGE} from 'squad-server/events';

/**
 * Shuffle an array randomly.
 * https://www.geeksforgeeks.org/how-to-shuffle-an-array-using-javascript/
 * @param {array} array
 * @return {array}
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate random number
    const j = Math.floor(Math.random() * (i + 1));

    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

export default {
  name: 'layer-rotation-bot',
  description: 'A layer rotation bot for BigD Gaming.',
  defaultEnabled: false,
  config: pluginConfig,
  botSay(message) {
    return `[${pluginConfig.botName}] ${message}`;
  },
  selectLayers(excludeMaps) {
    if (excludeMaps === undefined) {
      excludeMaps = [];
    }
    const shuffled = shuffleArray(allLayers.filter((layer) => {
      return !excludeMaps.includes(layer.map);
    }));
    return shuffled.reduce((acc, cur) => {
      if (acc.length < this.config.numberOfChoices) {
        return [...acc, cur];
      }
      return acc;
    }, []);
  },
  layersAsChoices(layers) {
    return layers.map((layer) => {
      return {
        name: layer.layer,
      };
    });
  },
  async init(server) {
    const voteBotOptions = {
      choices: this.layersAsChoices(this.selectLayers()),
      votingDurationSeconds: this.config.voteSeconds,
      onAnnouncement: function(message) {
        server.rcon.broadcast(this.botSay(message));
      },
      onPrivateMessage: function(playerID, message) {
        console.log(this.botSay(`Hey ${playerID}, ${message}`));
      },
      onVotingFinished: function(winner) {
        server.rcon.broadcast(this.botSay(`winning choice ${winner}`));
        setTimeout(() => {
          this.server.rcon.execute(`AdminSetNextMap ${winner.layer.layer}`)
        }, this.config.afterVoteSeconds * 1000);
      },
    };
    const voteBot = new VoteBot(voteBotOptions);

    // chat commands
    const commandDispatcher = new CommandDispatcher();

    commandDispatcher.setCanUseCommand(() => true);

    commandDispatcher.register('!vote', (userId, choiceNumber) => {
      const choiceNumeric = Math.floor(choiceNumber);
      if (isNaN(choiceNumeric)) {
        return;
      }
      voteBot.updateVote(userId, choiceNumeric);
    });

    server.on(CHAT_MESSAGE, (info) => {
      const message = info.message;
      const userId = info.steamID;
      commandDispatcher.handle(message, userId);
    });
  },
};
