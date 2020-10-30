import VoteBot from './VoteBot';

describe('VoteBot start to finish', () => {
  test('simple scenario', () => {
    return new Promise((resolve) => {
      const options = {
        choices: [
          {
            name: 'Al Basrah AAS v1',
          },
          {
            name: 'Al Basrah AAS v2',
          },
          {
            name: 'Al Basrah AAS v3',
          },
          {
            name: 'Al Basrah AAS v4',
          },
        ],
        votingDurationSeconds: 1,
        onAnnouncement: function(message) {
          console.log(`[VoteBot Test] ${message}`);
        },
        onPrivateMessage: function(playerID, message) {
          console.log(`[VoteBot Test] to ${playerID}] ${message}`);
        },
        onVotingFinished: function(winner) {
          console.log(`[VoteBot Test] winning choice ${winner}`);

          expect(winner.name).toBe('Al Basrah AAS v3');

          resolve();
        },
      };
      const voteBot = new VoteBot(options);

      voteBot.startVoting();

      voteBot.updateVote('player1', 1);
      voteBot.updateVote('player2', 2);
      voteBot.updateVote('player3', 3);
      voteBot.updateVote('player4', 3);
      voteBot.updateVote('player5', 3);
      voteBot.updateVote('player6', 4);
    });
  });
  test('simple scenario 2', () => {
    return new Promise((resolve) => {
      const options = {
        choices: [
          {
            name: 'Al Basrah AAS v1',
          },
          {
            name: 'Al Basrah AAS v2',
          },
          {
            name: 'Al Basrah AAS v3',
          },
          {
            name: 'Al Basrah AAS v4',
          },
        ],
        votingDurationSeconds: 1,
        onAnnouncement: function(message) {
          console.log(`[VoteBot Test] ${message}`);
        },
        onPrivateMessage: function(playerID, message) {
          console.log(`[VoteBot Test] to ${playerID}] ${message}`);
        },
        onVotingFinished: function(winner) {
          console.log(`[VoteBot Test] winning choice ${winner}`);

          expect(winner.name).toBe('Al Basrah AAS v2');

          resolve();
        },
      };
      const voteBot = new VoteBot(options);

      voteBot.startVoting();

      voteBot.updateVote('player1', 1);
      voteBot.updateVote('player2', 2);
      voteBot.updateVote('player3', 2);
      voteBot.updateVote('player4', 2);
      voteBot.updateVote('player5', 3);
      voteBot.updateVote('player6', 4);
    });
  });
  test('votes out of range', () => {
    return new Promise((resolve) => {
      const options = {
        choices: [
          {
            name: 'Al Basrah AAS v1',
          },
          {
            name: 'Al Basrah AAS v2',
          },
          {
            name: 'Al Basrah AAS v3',
          },
          {
            name: 'Al Basrah AAS v4',
          },
        ],
        votingDurationSeconds: 1,
        onAnnouncement: function(message) {
          console.log(`[VoteBot Test] ${message}`);
        },
        onPrivateMessage: function(playerID, message) {
          console.log(`[VoteBot Test] to ${playerID}] ${message}`);
        },
        onVotingFinished: function(winner) {
          console.log(`[VoteBot Test] winning choice ${winner}`);

          expect(winner.name).toBe('Al Basrah AAS v3');

          resolve();
        },
      };
      const voteBot = new VoteBot(options);

      voteBot.startVoting();

      voteBot.updateVote('player1', 1);
      voteBot.updateVote('player2', 2);
      voteBot.updateVote('player3', 3);
      voteBot.updateVote('player4', 3);
      voteBot.updateVote('player5', 8);
      voteBot.updateVote('player6', 9999);
    });
  });
  test('tie should be won by furthers down list', () => {
    return new Promise((resolve) => {
      const options = {
        choices: [
          {
            name: 'Al Basrah AAS v1',
          },
          {
            name: 'Al Basrah AAS v2',
          },
          {
            name: 'Al Basrah AAS v3',
          },
          {
            name: 'Al Basrah AAS v4',
          },
        ],
        votingDurationSeconds: 1,
        onAnnouncement: function(message) {
          console.log(`[VoteBot Test] ${message}`);
        },
        onPrivateMessage: function(playerID, message) {
          console.log(`[VoteBot Test] to ${playerID}] ${message}`);
        },
        onVotingFinished: function(winner) {
          console.log(`[VoteBot Test] winning choice ${winner}`);

          expect(winner.name).toBe('Al Basrah AAS v3');

          resolve();
        },
      };
      const voteBot = new VoteBot(options);

      voteBot.startVoting();

      voteBot.updateVote('player1', 1);
      voteBot.updateVote('player2', 2);
      voteBot.updateVote('player3', 2);
      voteBot.updateVote('player4', 3);
      voteBot.updateVote('player5', 3);
      voteBot.updateVote('player6', 4);
    });
  });
});
