import CommandDispatcher from './CommandDispatcher';

const returnTrue = () => true;

describe('CommandDispatcher tests', () => {
  test('dispatch a registered command', () => {
    const dispatcher = new CommandDispatcher();
    let resultColor = '';
    let resultNumber = '';
    const unchangedColor = 'blue';
    dispatcher.register('!test', (userId, color, number) => {
      resultColor = color;
      resultNumber = number;
    });
    dispatcher.setCanUseCommand(returnTrue);
    dispatcher.handle('!test red 123', '');

    expect(resultColor).toBe('red');
    expect(resultNumber).toBe('123');
    expect(unchangedColor).toBe('blue');
  });
  test('dispatch an unregistered command', () => {
    const dispatcher = new CommandDispatcher();
    let resultColor = '';
    let resultNumber = '';
    const unchangedColor = 'blue';
    dispatcher.register('!test', (userId, color, number) => {
      resultColor = color;
      resultNumber = number;
    });
    dispatcher.setCanUseCommand(returnTrue);
    dispatcher.handle('!unregistered red 123', '');

    expect(resultColor).toBe('');
    expect(resultNumber).toBe('');
    expect(unchangedColor).toBe('blue');
  });
  test('dispatch a command that the user is not allowed to use', () => {
    const dispatcher = new CommandDispatcher();
    let resultColor = '';
    let resultNumber = '';
    const unchangedColor = 'blue';
    dispatcher.register('!test', (userId, color, number) => {
      resultColor = color;
      resultNumber = number;
    });
    dispatcher.setCanUseCommand((command, userId) => {
      return !(command === '!test' && userId === 'testUserId');
    });
    dispatcher.handle('!test red 123', 'testUserId');

    expect(resultColor).toBe('');
    expect(resultNumber).toBe('');
    expect(unchangedColor).toBe('blue');
  });
  test('dispatch multiple commands', () => {
    const dispatcher = new CommandDispatcher();
    let resultColor = '';
    let resultNumber = '';
    let resultAnimal = '';
    let resultFish = '';
    const unchangedColor = 'blue';
    dispatcher.register('!color', (userId, x) => {
      resultColor = x;
    });
    dispatcher.register('!number', (userId, x) => {
      resultNumber = x;
    });
    dispatcher.register('!animal', (userId, x) => {
      resultAnimal = x;
    });
    dispatcher.register('!fish', (userId, x) => {
      resultFish = x;
    });
    dispatcher.setCanUseCommand(returnTrue);
    dispatcher.handle('!color red', 'testUserId');
    expect(resultColor).toBe('red');
    dispatcher.handle('!number 123', 'testUserId');
    expect(resultNumber).toBe('123');
    dispatcher.handle('!animal dog', 'testUserId');
    expect(resultAnimal).toBe('dog');
    dispatcher.handle('!fish nemo', 'testUserId');
    expect(resultFish).toBe('nemo');
    expect(unchangedColor).toBe('blue');
  });
});
