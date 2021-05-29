import SquadLayerFilter from 'core/squad-layers';
import optionsSpec from './optionsSpec.js';
import VoteBot from './VoteBot/VoteBot';
import CommandDispatcher from './CommandDispatcher/CommandDispatcher';
import {CHAT_MESSAGE} from 'squad-server/events';

export default {
  name: 'layer-rotation-bot',
  description: 'A layer rotation bot for BigD Gaming.',
  defaultEnabled: false,
  optionsSpec,
  async init(server, options) {
    const voteBot = createVoteBot(server, options);
    const voteBotCommandDispatcher = createVoteBotCommandDispatcher(
        server,
        options,
        voteBot,
    );
  },
};

export function randomElements(pool, count) {
  return shuffleArray(pool).reduce((acc, el) => {
    if (acc.length < count) {
      acc.push(el);
    }
    return acc;
  }, []);
}

export function layersAsChoices(layers) {
  return layers.map((layer) => {
    return {
      name: layer.layer,
    };
  });
}

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

function createVoteBot(server, options) {
  const layerFilter = SquadLayerFilter.buildFromFilter(
      {
        'whitelistedLayers': null,
        'blacklistedLayers': null,
        'whitelistedMaps': null,
        'blacklistedMaps': null,
        'whitelistedGamemodes': null,
        'blacklistedGamemodes': [
          'Training',
        ],
        'flagCountMin': null,
        'flagCountMax': null,
        'hasCommander': null,
        'hasTanks': null,
        'hasHelicopters': null,
      },
      {
        'historyResetTime': 18000000,
        'layerHistoryTolerance': 8,
        'mapHistoryTolerance': 4,
        'gamemodeHistoryTolerance': {
        },
        'gamemodeRepetitiveTolerance': {
        },
        'playerCountComplianceEnabled': true,
        'factionComplianceEnabled': true,
        'factionHistoryTolerance': {
        },
        'factionRepetitiveTolerance': {
        },
      },
  );

  const selectLayers = (numberOfChoices) => {
    return randomElements(layerFilter.getLayers(), numberOfChoices);
  };

  const botSay = (message) => {
    return `[${options.botName}] ${message}`;
  };
  const onAnnouncement = (message) => server.rcon.broadcast(
      botSay(message),
  );
  const onPrivateMessage = (playerID, message) => console.log(
      botSay(`Hey ${playerID}, ${message}`),
  );
  const onVotingFinished = (winner) => {
    server.rcon.broadcast(
        botSay(`winning choice ${winner}`),
    );
    setTimeout(
        () => {
          server.rcon.execute(`AdminSetNextMap ${winner.layer.layer}`);
        },
        options.afterVoteSeconds * 1000,
    );
  };

  const voteBotOptions = {
    choices: layersAsChoices(selectLayers(options.numberOfChoices)),
    votingDurationSeconds: options.voteSeconds,
    onAnnouncement,
    onPrivateMessage,
    onVotingFinished,
  };

  return new VoteBot(voteBotOptions);
}

function createVoteBotCommandDispatcher(server, options, voteBot) {
  const commandDispatcher = new CommandDispatcher();

  const userCommands = [
    '!votelayer',
  ];

  commandDispatcher.setCanUseCommand(
      (command, userId, isAdmin) => {
        if (!isAdmin && !userCommands.includes(command)) {
          console.log(
              `${userId} attempted to use ${command} but they are not admin`,
          );
        }
        return true;
      },
  );

  commandDispatcher.register('!votelayer', (userId, choiceNumber) => {
    const choiceNumeric = Math.floor(choiceNumber);
    if (isNaN(choiceNumeric)) {
      return;
    }
    voteBot.updateVote(userId, choiceNumeric);
  });

  server.on(CHAT_MESSAGE, (info) => {
    const {message, steamID, chat} = info;
    commandDispatcher.handle(message, steamID, chat === 'ChatAdmin');
  });

  return commandDispatcher;
}
