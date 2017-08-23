/**
 * Object to keep trace of modifications applied to the
 * workspace to rollback later.
 */
function BackStack () {
  this.reset()
}

/**
 * Reset the entire stack to initial state
 */
BackStack.prototype.reset = function () {
  this.stack = []
  this.currentAction = null
}

/**
 * Start collecting for a new action in progress
 */
BackStack.prototype.startAction = function () {
  this.currentAction = []
}

/**
 * Add modifications applied to the current action.
 * Every modification is based on 2 things: position and value
 * If a position has already been set in the current action
 * it will be ignored.
 * 
 * @param position number Triangle index to modify
 * @param position string Old value of the triangle
 */
BackStack.prototype.actionStack = function (position, oldValue) {
  if (!this.currentAction.find(x => x[0] === position)) {
    this.currentAction.push([position, oldValue])
  }
}

/**
 * Ends the current action and stack it
 */
BackStack.prototype.endAction = function () {
  if (!this.currentAction || !this.currentAction.length) {
    return
  }
  this.stack.push(this.currentAction)
  this.currentAction = null
}

/**
 * Extract the last action from the stack and return it
 * @return array Action object
 */
BackStack.prototype.popLastAction = function () {
  return this.stack.pop()
  console.log()
}

export default BackStack