function Earth () {
  this.queue = []
}

Earth.prototype._loop = function () {
  TWEEN.update()
  requestAnimationFrame(this._loop.bind(this))
}

Earth.prototype.rotate = function () {
  var that = this
  this.tween = new TWEEN.Tween().to().start()
  this.tween.onComplete = function () {
    var stack = that.queue.shift
    that[stack.method].apply(that, stack.args)
  }
  return {
    zoomIn: function () {
      that.queue.push({method: 'zoomIn', args: arguments})
    }
  }
}

Earth.prototype.zoomIn = function () {
  this.tween = new TWEEN.Tween().to().start()
  this.tween.onComplete = function () {}
}

Earth.prototype.zoomOut = function () {
  this.tween = new TWEEN.Tween().to().start()
  this.tween.onComplete = function () {}
}

Earth.prototype.moveTo = function (name) {
  let twRotate = new TWEEN.Tween({}).to()
  let twZoomIn = new TWEEN.Tween({}).to()
  let twZoomOut = new TWEEN.Tween({}).to()

  twRotate.chain(twZoomIn)
  twZoomIn.chain(twZoomOut)
  twRotate.start()
}


var earth = new Earth()
earth.rotateTo('greenland').zoomIn('greenland').zoomOut('greenland')
