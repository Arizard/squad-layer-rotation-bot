export default {
  numberOfChoices: {
    required: true,
    description: 'How many layers to include in the layer pool.',
    default: 4,
    example: 4,
  },
  voteSeconds: {
    required: true,
    description: 'How many seconds the voting period lasts.',
    default: 20,
    example: 20,
  },
  afterVoteSeconds: {
    required: true,
    description: 'How many seconds to wait after the voting period ' +
      'before the layer changes.',
    default: 5,
    example: 5,
  },
  botName: {
    required: true,
    description: 'The name of the bot (displayed in chat).',
    default: 'Layer Vote',
    example: 'Layer Vote',
  },
};
