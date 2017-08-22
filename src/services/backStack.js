function BackStack () {
  this.reset()
}

BackStack.prototype.reset = function () {
  this.stack = []
  this.currentAction = null
}

BackStack.prototype.startAction = function () {
  this.currentAction = []
}

BackStack.prototype.actionStack = function (position, oldValue) {
  if (!this.currentAction.find(x => x[0] === position)) {
    this.currentAction.push([position, oldValue])
  }
}

BackStack.prototype.endAction = function () {
  if (!this.currentAction || !this.currentAction.length) {
    return
  }
  this.stack.push(this.currentAction)
  this.currentAction = null
}

BackStack.prototype.popLastAction = function () {
  return this.stack.pop()
}

export default BackStack