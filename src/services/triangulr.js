import storage from './storage.js'
import BackStack from './backStack.js'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

/**
 * Triangulr class
 * The magic artbord to manipulate the grid of pixels
 */
function Triangulr () {}

Triangulr.prototype.BGR_COLOR = '#FFFFFF'
Triangulr.prototype.DEFAULT_FILL_COLOR = '#000000'
Triangulr.prototype.BLANK_COLOR = 'none'
Triangulr.prototype.AUTOSAVE_TIMER = 5000
Triangulr.prototype.TRIANGLE_WIDTH = 30

Triangulr.prototype.ACTION_FILL = 1
Triangulr.prototype.ACTION_ERASE = 2
Triangulr.prototype.ACTION_MOVE = 3
Triangulr.prototype.ACTION_SELECT = 4

/**
 * Sets the container of the artboard
 *
 * @param {DOMElement|string} container Container DOM or it's ID
 */
Triangulr.prototype.setContainer = function (container) {
  if (container.constructor === String) {
    container = document.getElementById(container)
  }
  if (!container) {
    throw new Error ('Triangulr container "' + containerId + '" does not exists.')
  }
  this.container = container
}

/**
 * Set the canvas properties.
 * This will reset the entire instance.
 *
 * @param  int      width        Map width
 * @param  int      height       Map height
 * @param  boolean  isLandscape  Grid rientation
 */
Triangulr.prototype.setCanvas = function (width, height, isLandscape) {
  // Save input
  this.isLandscape = isLandscape
  this.mapWidth = parseInt(width, 10)
  this.mapHeight = parseInt(height, 10)

  this.triangleWidth = this.TRIANGLE_WIDTH
  this.triangleHeight = Math.sqrt(Math.pow(this.triangleWidth, 2) - Math.pow(this.triangleWidth / 2, 2))
  this.triangleHeight = Math.round(this.triangleHeight)

  this.blockWidth = (this.triangleWidth / 2)
  this.blockRatio = this.blockWidth / this.triangleHeight
  this.lineLength = (this.isLandscape ? this.mapWidth : this.mapHeight) * 2 - 1

  this.lines = []
  this.exportData = []
  this.palette = []
  this.selection = null
  this.backStack = new BackStack()

  this.lineMapping()
  this.createTriangles()
  this.generateDom()

  window.debugPlayground = this //# DEV : kill this
}

/**
 * lineMapping
 * generate this.lines from the contructor info
 *
 */
Triangulr.prototype.lineMapping = function () {

  let x, y, line,
      parity = this.triangleWidth / 4,
      gap = parity

  if (this.isLandscape) {
    for (y = 0; y<=this.mapHeight; y++) {
      line = []
      for (x = 0; x<=this.mapWidth; x++) {
        line.push({
          x: x * this.triangleWidth + parity + gap,
          y: y * this.triangleHeight
        })
      }
      this.lines.push(line)
      parity *= -1
    }
  }
  else {
    for (y = 0; y<=this.mapWidth; y++) {
      line = []
      for (x = 0; x<=this.mapHeight; x++) {
        line.push({
          x: y * this.triangleHeight,
          y: x * this.triangleWidth + parity + gap
        })
      }
      this.lines.push(line)
      parity *= -1
    }
  }
}

/**
 * createTriangles
 * use points form this.lines to generate triangles
 * and put them into this.exportData
 *
 */
Triangulr.prototype.createTriangles = function () {

  let x, parity, lineA, lineB, aIndex, bIndex, points, poly, pointsList,
      counter = 0,
      lineParite = true
  this.exportData = []

  for (x = 0; x<this.lines.length -1; x++) {
    lineA = this.lines[x]
    lineB = this.lines[x+1]
    aIndex = 0
    bIndex = 0
    parity = lineParite

    do {
      // Get the good points
      points = [lineA[aIndex], lineB[bIndex]]
      if (parity) {
        bIndex++
        points.push(lineB[bIndex])
      }
      else {
        aIndex++
        points.push(lineA[aIndex])
      }
      parity = !parity

      // Save the triangle
      pointsList = [
        points[0],
        points[1],
        points[2]
      ]
      this.exportData.push({
        points: pointsList
      })
      counter++
    } while (aIndex != lineA.length-1 && bIndex != lineA.length-1)

    lineParite = !lineParite
  }
}

/**
 * Generate the SVG object from exportData content and
 * start listening to events. This SVG will be the
 * workspace of this instance.
 *
 * @return SVGDOMElement SVG DOM object
 */
Triangulr.prototype.generateDom = function () {
  if (this.svgTag) {
    this.container.removeChild(this.svgTag)
    this.svgTag.remove()
  }

  let svgTag = this.generateSVG(),
      pos = null
  
  //# CLEAN : Move these listeners to own methods
  var startActionListener = (e) => {
    if (this.action === this.ACTION_SELECT &&
        this.selection && this.selection.coordinates &&
        childOf(e.target, this.selection.selectArea)) {
      console.log('Drag start')
      this.selection.dragStart = this.coordinatorFromEvent(e)
    }
    else {
      console.log('NOT Drag start')
      moveListener(e)
    }
  }

  var moveListener = (e) => {
    let position = this.coordinatorFromEvent(e)
    if (!position || position.index === pos) {
      return
    }
    pos = position.index

    switch (this.action) {
    case this.ACTION_FILL:
      this.fillTriangle(pos, this.color)
      break
    
    case this.ACTION_ERASE:
    this.fillTriangle(pos)
      break
    
    case this.ACTION_MOVE:
      break

    case this.ACTION_SELECT:
      if (this.selection && this.selection.dragStart) {
        this.updateSelectionDrag(position)
      }
      else {
        this.updateSelection(position)
      }
      break
    }
  }

  var endActionListener = (e) => {
    if (this.action === this.ACTION_SELECT) {
      e.preventDefault()
      if (this.selection.coordinates) {
        this.endSelectionDrag()
      }
      else {
        this.endSelection()
      }
      this.selection.dragStart = null
    }
    this.backStack.endAction()
    this.saveTimeout()
  }

  // Mouse listeners
  svgTag.addEventListener('mousedown', (e) => {
    this.backStack.startAction()
    startActionListener(e)
    let mouseUpListener = (e) => {
      svgTag.removeEventListener('mousemove', moveListener)
      window.removeEventListener('mouseup', mouseUpListener)
      endActionListener(e)
    }
    svgTag.addEventListener('mousemove', moveListener)
    window.addEventListener('mouseup', mouseUpListener)
  })

  // Touch listeners
  svgTag.addEventListener('touchstart', (e) => {
    if (this.action === this.ACTION_MOVE) {
      return
    }
    this.backStack.startAction()
    startActionListener(e)

    let touchEndListener = (e) => {
      svgTag.removeEventListener('touchmove', moveListener)
      window.removeEventListener('touchend', touchEndListener)
      endActionListener(e)
    }
    svgTag.addEventListener('touchmove', moveListener)
    window.addEventListener('touchend', touchEndListener)
  })

  // Set the SVG
  this.svgTag = svgTag
  this.container.appendChild(svgTag)
  return svgTag
}

/**
 * Call the coordinator from an event
 * @param event e Mouse or touch event on the svgTag
 * @return object Triangle information
 */
Triangulr.prototype.coordinatorFromEvent = function (e) {
  if (~e.type.indexOf('mouse')) {
    return this.coordinator(e.pageX - 16, e.pageY - 16)
  }
  else {
    e.preventDefault();
    return this.coordinator(e.touches[0].pageX - 16, e.touches[0].pageY - 16)
  }
}

/**
 * Return the info about a triangle available
 * at a specific position.
 * 
 * If a triangle  coordinate are avalable, the method will
 * return a following object
 * {
 *   x: (int) column index,
 *   y: (int) line index,
 *   index: (int) triangle index
 * }
 * 
 * Or null if no triangle is at these coordinates
 * 
 * @param int x X position in pixels
 * @param int y Y position in pixels
 * @return object Triangle informations
 */
Triangulr.prototype.coordinator = function (x, y) {
    
  if (!this.isLandscape) {
    [x, y] = [y, x]
  }

  let line = Math.floor(y / this.triangleHeight),
      isEvenLine = line % 2 === 0,
      blockIndex = Math.floor(x / this.blockWidth),
      isEvenBlock = blockIndex % 2 === 0,
      blockX = x % this.blockWidth,
      blockY = y % this.triangleHeight

  if (isEvenBlock && isEvenLine || (!isEvenBlock && !isEvenLine)) {
    if ((blockX / (this.triangleHeight - blockY)) < this.blockRatio) {
      blockIndex--
    }
  }
  else {
    if ((blockX / blockY) < this.blockRatio) {
      blockIndex--
    }
  }

  if (blockIndex < 0 || blockIndex >= this.lineLength) {
    return null
  }
  else {
    return {
      x: blockIndex,
      y: line,
      index: this.lineLength * line + blockIndex
    }
  }
}

/**
 * Update the selection in progress.
 * This method is called during the drag
 * between the user mouse down and up.
 * This will update the selection rectangle.
 * 
 */
Triangulr.prototype.updateSelection = function (position) {
  if (this.selection && this.selection.coordinates) {
    this.clearSelection()
  }
  if (!this.selection) {
    this.selection = {
      start: position,
      selectArea: document.createElementNS(SVG_NAMESPACE, 'rect')
    }
    this.selection.selectArea.setAttribute('class', 'selector-rect')
    this.svgTag.appendChild(this.selection.selectArea)
  }
  this.selection.end = position

  let start = this.selection.start,
      end = this.selection.end,
      rect = this.selection.selectArea,
      minX = Math.min(start.x, end.x) * this.blockWidth,
      maxX = (Math.max(start.x, end.x) + 2) * this.blockWidth,
      minY = Math.min(start.y, end.y) * this.triangleHeight,
      maxY = (Math.max(start.y, end.y) + 1) * this.triangleHeight

  if (this.isLandscape) {
    rect.setAttribute('x', minX)
    rect.setAttribute('y', minY)
    rect.setAttribute('width', maxX - minX)
    rect.setAttribute('height', maxY - minY)
  }
  else {
    rect.setAttribute('x', minY)
    rect.setAttribute('y', minX)
    rect.setAttribute('width', maxY - minY)
    rect.setAttribute('height', maxX - minX)
  }
}

/**
 * Ends the selection in progress.
 * It will finalise the selection rectangle and
 * set the `coordinates` properties to the
 * `selection` object to provide all the required
 * information about the selection.
 * 
 * width    selection width
 * height   selection height
 * offsetX  origin position X of the selection
 * offsetY  origin position XY of the selection
 * moveX    drag X coordinates
 * moveY    drag Y coordinates
 * 
 */
Triangulr.prototype.endSelection = function () {
  if (!this.selection) {
    return
  }

  let blank, 
      blankArea = document.createElementNS(SVG_NAMESPACE, 'g'),
      clones = document.createElementNS(SVG_NAMESPACE, 'g'),
      start = this.selection.start,
      end = this.selection.end,
      offsetX = Math.min(start.x, end.x),
      width = Math.max(start.x, end.x) - offsetX + 1,
      offsetY = Math.min(start.y, end.y),
      height = Math.max(start.y, end.y) - offsetY + 1

  this.selection.coordinates = {
    width,
    height,
    offsetX,
    offsetY,
    moveX: 0,
    moveY: 0
  }

  this.indexesFromCoordinates(offsetX, offsetY, width, height)
    .map(index => {
      blank = this.svgTag.childNodes[index].cloneNode()
      clones.appendChild(blank.cloneNode())
      blank.setAttribute('fill', this.BGR_COLOR)
      blankArea.appendChild(blank)
    })

  clones.appendChild(this.selection.selectArea)
  clones.setAttribute('class', 'movable')
  this.selection.selectArea = clones
  this.selection.blankArea = blankArea
  this.svgTag.appendChild(blankArea)
  this.svgTag.appendChild(clones)
}

/**
 * Bulk method to return a list of triangle
 * indexes from a map area.
 * If the coordinates are invalid,
 * the method will throw an error.
 * 
 * (2, 0, 1, 2)
 * > [4, 5, 132, 133]
 */
Triangulr.prototype.indexesFromCoordinates = function (x, y, width, height) {
  if (x < 0 || y < 0 || width < 0 || height < 0 || (x+width) > this.lineLength || (y+height) > this.mapHeight) {
    throw new Error ('Try to get indexes from invalid coordinates')
  }
  let output = []
  for (let yPos = 0; yPos < height; yPos++) {
    for (let xPos = 0; xPos < width; xPos++) {
      output.push((yPos + y) * this.lineLength + xPos + x)
    }
  }
  return output
}

/**
 * Update the dragging of the selection
 * @param object position Position object from coordinator method
 */
Triangulr.prototype.updateSelectionDrag = function (position) {
  let coor = this.selection.coordinates,
      dragX = Math.round((position.x - this.selection.dragStart.x)/2) * 2,
      dragY = Math.round((position.y - this.selection.dragStart.y)/2) * 2

  if (this.isLandscape) {
    let newX  = dragX + coor.offsetX + coor.moveX,
        newY  = dragY + coor.offsetY + coor.moveY

    if (newX >= 0 && (newX + coor.width) <= this.lineLength && newY >= 0 && (newY + coor.height) <= this.mapHeight) {
      coor.dragX = dragX
      coor.dragY = dragY
      this.selection.selectArea.style.transform = `translate(${(coor.moveX+dragX)*this.blockWidth}px,${(coor.moveY+dragY)*this.triangleHeight}px)`
    }
  }
  else {
    [dragX, dragY] = [dragY, dragX]
    let newX  = dragY + coor.offsetX + coor.moveY,
        newY  = dragX + coor.offsetY + coor.moveX

    if (newX >= 0 && (newX + coor.width) <= this.lineLength && newY >= 0 && (newY + coor.height) <= this.mapHeight) {
      coor.dragX = dragX
      coor.dragY = dragY
      this.selection.selectArea.style.transform = `translate(${(coor.moveX+dragX)*this.triangleHeight}px,${(coor.moveY+dragY)*this.blockWidth}px)`
    }
  }
}

/**
 * Method called at the en od a drag
 * move on a selection. (:when you move
 * a selection from a point A to B)
 */
Triangulr.prototype.endSelectionDrag = function () {
  let coordinates = this.selection.coordinates
  coordinates.moveX += coordinates.dragX
  coordinates.moveY += coordinates.dragY  
}

/**
 * Apply the current seelction if exists (and moved)
 * and clear the related items to the selection.
 */
Triangulr.prototype.clearSelection = function () {
  if (!this.selection) {
    return
  }
  this.applySelection()
  if (this.selection.blankArea) {
    this.svgTag.removeChild(this.selection.blankArea)
  }
  this.svgTag.removeChild(this.selection.selectArea)
  this.selection = null
}

/**
 * Apply the current selection
 */
Triangulr.prototype.applySelection = function () {
  if (!this.selection || !this.selection.coordinates ||
      (!this.selection.coordinates.moveX && !this.selection.coordinates.moveY && !this.selection.action)) {
    return
  }
  this.backStack.startAction()
  let c = this.selection.coordinates,
      action = this.selection.action || {},
      colors = this.indexesFromCoordinates(
        c.offsetX,
        c.offsetY,
        c.width,
        c.height
      ).map(index => {
        let cc = this.exportData[index].color
        this.fillTriangle(index)
        return cc
      })

  if (!action.erase) {
    this.indexesFromCoordinates(
      c.offsetX + (this.isLandscape ? c.moveX : c.moveY),
      c.offsetY + (this.isLandscape ? c.moveY : c.moveX),
      c.width,
      c.height
    )
    .forEach((pointIndex, index) => {
      this.fillTriangle(pointIndex, action.fill || colors[index])
    })
  }
  this.backStack.endAction()
}

/**
 * Fill the current selection with a color
 * It will update manually the selection DOM
 * and the color to fill for `applySelection` method.
 * 
 * @param string color New color to set
 */
Triangulr.prototype.fillSelection = function (color) {
  if (!this.selection || !this.selection.coordinates) {
    return
  }

  this.selection.selectArea
    .querySelectorAll('path')
    .forEach(path => path.setAttribute('fill', color || this.BGR_COLOR))
  this.selection.action = {fill: color}
}

/**
 * Erase the current selection and clear it.
 */
Triangulr.prototype.eraseSelection = function () {
  if (!this.selection || !this.selection.coordinates) {
    return
  }
  this.selection.action = {erase: true}
  this.clearSelection()
}

/**
 * Set the new color to a triangle.
 * This method will apply all the necessary steps:
 * - Add the update to the backstack
 * - Update the color in the export data
 * - Update the SVG
 * 
 * @param number pos    Index position of the triangle
 * @param color  string New color to set (undefined for erasing)
 */
Triangulr.prototype.fillTriangle = function (pos, color) {
  this.backStack.actionStack(pos, this.exportData[pos].color)
  this.exportData[pos].color = color === undefined ? null : (color || this.exportData[pos].color)
  this.svgTag.childNodes[pos].setAttribute('fill', this.exportData[pos].color || this.BLANK_COLOR)
}

/**
 * Generate the SVG map from the information
 * of the instance. An optional boolean is available
 * to generate a clean SVG to produce a lightweight
 * SVG (used for export)
 * 
 * @param boolean isClean To produce a clean SVG
 * @return SVGDOMElement The artwork
 */
Triangulr.prototype.generateSVG = function (isClean) {
  let i, data, points, polygon,
      svgTag = document.createElementNS(SVG_NAMESPACE, 'svg')

  svgTag.setAttribute('version', '1.1')
  svgTag.setAttribute('preserveAspectRatio', 'xMinYMin slice')
  if (this.isLandscape) {
    svgTag.setAttribute('width', this.mapWidth * this.triangleWidth)
    svgTag.setAttribute('height', this.mapHeight * this.triangleHeight)
    svgTag.setAttribute('viewBox', '0 0 ' + (this.mapWidth * this.triangleWidth) + ' ' + (this.mapHeight * this.triangleHeight))
  }
  else {
    svgTag.setAttribute('width', this.mapWidth * this.triangleHeight)
    svgTag.setAttribute('height', this.mapHeight * this.triangleWidth)
    svgTag.setAttribute('viewBox', '0 0 ' + (this.mapWidth * this.triangleHeight) + ' ' + (this.mapHeight * this.triangleWidth))
  }

  // Metadata
  if (isClean) {
    svgTag.appendChild(document.createComment(JSON.stringify({
      isLandscape: this.isLandscape,
      mapWidth: this.mapWidth,
      mapHeight: this.mapHeight,
      palette: this.palette
    })))
  }

  for (i in this.exportData) {
    data = this.exportData[i]
    if (isClean && !data.color) {
      continue
    }
    polygon = document.createElementNS(SVG_NAMESPACE,'path')
    points   = 'M' + data.points[0].x + ' ' + data.points[0].y + ' '
    points  += 'L' + data.points[1].x + ' ' + data.points[1].y + ' '
    points  += 'L' + data.points[2].x + ' ' + data.points[2].y + ' Z'
    polygon.setAttribute('d', points)
    if (!isClean || data.color !== this.DEFAULT_FILL_COLOR) {
      polygon.setAttribute('fill', data.color || this.BLANK_COLOR)
    }
    polygon.setAttribute('rel', i)
    svgTag.appendChild(polygon)
  }
  return svgTag
}

/**
 * Get the output clean SVG for user consumption
 * @return string SVG data
 */
Triangulr.prototype.exportSVG = function () {
  return this.generateSVG(true).outerHTML
}

/**
 * Reset the instance with data provided in paramater.
 * The data object contain:
 * 
 * mapWidth    number
 * mapHeight   number
 * mapData     array (Map of colors)
 * isLandscape boolean
 * palette     array (List color palette)
 */
Triangulr.prototype.import = function (data) {
  this.setCanvas(
    data.mapWidth,
    data.mapHeight,
    data.isLandscape
  )

  this.palette = data.palette || []
  this.backStack.reset()

  for (var i in data.mapData) {
    this.exportData[i].color = data.mapData[i]
  }

  for (var i = 0; i < this.svgTag.childNodes.length; i++) {
    this.svgTag.childNodes[i].setAttribute('fill', this.exportData[i].color || this.BLANK_COLOR)
  }
}

/**
 * Export workspace data
 * @return object Workspace config
 */
Triangulr.prototype.export = function () {
  return {
    isLandscape: this.isLandscape,
    mapWidth: this.mapWidth,
    mapHeight: this.mapHeight,
    mapData: this.exportData.map(function (e) {return e.color || null}),
    palette: this.palette
  }
}

/**
 * Load config from file.
 * The input is always a string. The format can be
 * JSON (for legacy systems) or SVG for v2 users.
 * If the parsing or the format is invalid, an error
 * will be triggered.
 * 
 * @param string data Input data
 */
Triangulr.prototype.loadWorkspaceFromFile = function (data) {
  // Check data input (JSON or SVG)
  let config
  if (data[0] === '{') {
    config = JSON.parse(data)
    config.playground.palette = config.palette
    config = config.playground
  }
  else {
    let container = document.createElement('div')
    container.innerHTML = data
    let svg = container.querySelector('svg')
    if (!svg || !svg.childNodes[0] || svg.childNodes[0].nodeType !== 8) {
      throw new Error ('Invalid file format')
    }
    config = JSON.parse(svg.childNodes[0].textContent)
    config.mapData = []
    svg.querySelectorAll('path').forEach(path => {
      config.mapData[parseInt(path.getAttribute('rel'), 10)] = path.getAttribute('fill') || this.DEFAULT_FILL_COLOR
    })
  }

  this.import(config)
  this.workspace = storage.createItem('imported file')
  storage.updateItem(this.workspace.id, this.export())
  return this.workspace
}

/**
 * Load a workspace from the storage ID
 * @param number id Workspace index
 */
Triangulr.prototype.loadWorkspaceFromStorage = function (id) {
  this.workspace = {id}
  this.import(storage.getItem(id))
  return this.workspace
}

/**
 * Create and set a new workspace from settings
 * provided in options.
 *
 * width       number
 * height      number
 * isLandscape boolean
 * 
 * @param object data Options to set the new workspace
 */
Triangulr.prototype.newWorkspace = function (data) {
  console.log('newWorkspace', data)
  if (!data.isLandscape) {
    [data.width, data.height] = [data.height, data.width]
  }
  this.setCanvas(data.width, data.height, data.isLandscape);
  this.workspace = storage.createItem(data.name || 'untitled')
  storage.updateItem(this.workspace.id, this.export())
  return this.workspace
}

/**
 * Save the workspace in the local storage
 */
Triangulr.prototype.save = function () {
  storage.updateItem(this.workspace.id, this.export())
}

/**
 * Set a timeout to save the workspace.
 * Any new call will reset the timer.
 */
Triangulr.prototype.saveTimeout = function  () {
  //# DO NOT FORGET TO CLEAR THIS WHEN LEAVING THE WORKSPACE
  if (this.saveTimer) {
    clearTimeout(this.saveTimer)
  }
  this.saveTimer = setTimeout(() => this.save(), this.AUTOSAVE_TIMER)
}

/* Controls
 */

/**
 * togglePreview
 * toggle the class preview to the SVG
 * To show/hide the strokes
 *
 */
Triangulr.prototype.togglePreview = function () {
  if (!this.svgTag) {
    return
  }
  this.svgTag.classList.toggle('preview')
}

/**
 * Set a new mode to the editor between the following
 * actions:
 * 
 * ACTION_FILL
 * ACTION_ERASE
 * ACTION_MOVE
 * ACTION_SELECT
 * 
 * @param action  number Action index (from triangulr consts)
 */
Triangulr.prototype.setMode = function (action) {
  // No effects if the new action is the existing one
  if (this.action === action) {
    return
  }
  // Apply the selection if there's a seection
  if (this.action === this.ACTION_SELECT) {
    this.clearSelection()
  }
  this.action = action 
}

/**
 * Check the current action set
 * @param number action Action ID from class consts
 * @return boolean True is currently set
 */
Triangulr.prototype.isOnMode = function (action) {
  return this.action === action
}

/**
 * Set the current color
 * @param string color New pencil color
 */
Triangulr.prototype.setColor = function (color) {
  this.color = color
  if (this.isOnMode(this.ACTION_SELECT)) {
    this.fillSelection(color)
  }
}

/**
 * Add a color to the existing palette.
 * If the color is already in, it won't be added.
 * @param string color Color to add
 */
Triangulr.prototype.addColor = function (color) {
  if (!color || this.palette.indexOf(color) !== -1) {
    return
  }
  this.palette.push(color)
}

/**
 * Reverse the last action applied to the workspace
 */
Triangulr.prototype.undo = function () {
  let fill, backAction = this.backStack.popLastAction()
  for (let fillIndex in backAction) {
    fill = backAction[fillIndex]
    this.exportData[fill[0]].color = fill[1]
    this.svgTag.childNodes[fill[0]].setAttribute('fill', fill[1] || 'none')
  }
}

/**
 * Found at 
 * https://stackoverflow.com/questions/2234979/how-to-check-in-javascript-if-one-element-is-contained-within-another
 * +1 kudo for gitaarLab
 * @param {DOMElement} c Child node
 * @param {DOMElement} p Parent Node
 * @return boolean True if child of
 */
function childOf(c, p) {
  while((c=c.parentNode)&&c!==p);
  return !!c;
}

export default Triangulr
