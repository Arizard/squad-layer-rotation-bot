/** CommandDispatcher is a class used to manage the execution of commands based
 * on chat messages.
 */
export default class CommandDispatcher {
  constructor() {
    this.commands = new Map();
    this.canUseCommand = (command, userId) => {
      console.log(
          'no canUseCommand provided, which means commands registered with ' +
          'CommandDispatcher are inaccessible to all users.',
      );
      return false;
    };
  }

  /** Set the canUseCommand method of the CommandDispatcher.
   * @param {function} canUseCommand - a function which takes arguments command
   *                                   (e.g. "!vote") and userId (a unique
   *                                   string user id) and returns true if the
   *                                   user is allowed to use the command.
   */
  setCanUseCommand(canUseCommand) {
    this.canUseCommand = canUseCommand;
  }

  register(command, dispatch) {
    this.commands.set(command, dispatch);
  }

  /** Handle a message from a user by dispatching a command.
   * @param {string} message - the chat message
   * @param {string} userId - a unique identifier for the user */
  handle(message, userId) {
    const [command, ...args] = message.split(' ');
    if (this.canUseCommand(command, userId) !== true) {
      return;
    }
    if (!this.commands.has(command)) {
      console.log(
          `${userId} attempted command ${command} which was not registered.`,
      );
      return;
    }
    this.commands.get(command)(userId, ...args);
  }
}
