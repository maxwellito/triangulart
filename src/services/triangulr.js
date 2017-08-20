'use strict';

import storage from './storage.js'

/**
 * Triangulr class
 * instructions will follow, in an other commit, it's late now
 *
 * @param  string          containerId      Container DOM id
 */
function Triangulr (containerId) {
  this.container = document.getElementById(containerId);
  if (!this.container) {
    throw new Error ('Triangulr container "' + containerId + '" does not exists.');
  }
}

Triangulr.prototype.DEFAULT_COLOR = '#000';
Triangulr.prototype.BLANK_COLOR = '#FFF';

/**
 * Triangulr class
 * instructions will follow, in an other commit, it's late now
 *
 * @param  int              width            Triangle height
 * @param  int              height          Triangle height
 * @param  int              triangleHeight  Triangle height
 */
Triangulr.prototype.setCanvas = function (width, height, triangleWidth, isLandscape) {
  // Save input
  this.isLandscape = isLandscape;
  this.mapWidth = width;
  this.mapHeight = height;

  this.triangleWidth = triangleWidth;
  this.triangleHeight = Math.sqrt(Math.pow(triangleWidth, 2) - Math.pow(triangleWidth / 2, 2));
  this.triangleHeight = Math.round(this.triangleHeight);

  this.blockWidth = (this.triangleWidth / 2)
  this.blockRatio = this.blockWidth / this.triangleHeight
  this.lineLength = this.mapWidth * 2 - 1

  this.lines = [];
  this.exportData = [];
  this.pickedColor = this.DEFAULT_COLOR;

  this.isEditing = true;
  this.palette = [];

  this.lineMapping();
  this.createTriangles();
  this.generateDom();

  window.debugPlayground = this //# DEV : kill this
}

/**
 * lineMapping
 * generate this.lines from the contructor info
 *
 */
Triangulr.prototype.lineMapping = function () {

  var x, y, line;
  var parity = this.triangleWidth / 4;
  var gap = parity;

  if (this.isLandscape) {
    for(y = 0; y<=this.mapHeight; y++) {
      line = [];
      for(x = 0; x<=this.mapWidth; x++) {
        line.push({
          x: x * this.triangleWidth + parity + gap,
          y: y * this.triangleHeight
        });
      }
      this.lines.push(line);
      parity *= -1;
    }
  }
  else {
    for(y = 0; y<=this.mapWidth; y++) {
      line = [];
      for(x = 0; x<=this.mapHeight; x++) {
        line.push({
          x: y * this.triangleHeight,
          y: x * this.triangleWidth + parity + gap
        });
      }
      this.lines.push(line);
      parity *= -1;
    }
  }
};

/**
 * createTriangles
 * use points form this.lines to generate triangles
 * and put them into this.exportData
 *
 */
Triangulr.prototype.createTriangles = function () {

  var x, parity, lineA, lineB, aIndex, bIndex, points, poly, pointsList;
  var counter = 0;
  var lineParite = true;
  this.exportData = [];

  for(x = 0; x<this.lines.length -1; x++) {
    lineA = this.lines[x];
    lineB = this.lines[x+1];
    aIndex = 0;
    bIndex = 0;
    parity = lineParite;

    do {
      // Get the good points
      points = [lineA[aIndex], lineB[bIndex]];
      if (parity) {
        bIndex++;
        points.push(lineB[bIndex]);
      }
      else {
        aIndex++;
        points.push(lineA[aIndex]);
      }
      parity = !parity;

      // Save the triangle
      pointsList = [
        points[0],
        points[1],
        points[2]
      ];
      this.exportData.push({
        points: pointsList
      });
      counter++;
    } while (aIndex != lineA.length-1 && bIndex != lineA.length-1);

    lineParite = !lineParite;
  }
};

/**
 * generateDom
 * generate the SVG object from exportData content
 *
 * @return {[object]} Svg DOM object
 */
Triangulr.prototype.generateDom = function () {
  if (this.svgTag) {
    this.container.appendChild(this.svgTag);
    this.svgTag.remove();
  }

  let svgTag = this.generateSVG(),
      pos = null
  
  this.color = false
  
  var mouseListener = e => {
    moveListener(e.offsetX, e.offsetY)
  }

  var touchListener = e => {
    if (!this.isEditing) {
      return
    }
    e.preventDefault();

    moveListener(e.touches[0].pageX - 16, e.touches[0].pageY - 16)
  }

  var moveListener = (x, y) => {
    let position = this.coordinator(x, y)

    if (!position || position.index === pos || this.color === false) {
      return
    }
    
    pos = position.index
    this.exportData[pos].color = this.color;
    svgTag.childNodes[pos].setAttribute('fill', this.color || this.BLANK_COLOR);
  }

  svgTag.addEventListener('mousedown', (e) => {
    this.color = this.pickedColor;
    mouseListener(e)
    svgTag.addEventListener('mousemove', mouseListener)
  });

  window.addEventListener('mouseup', () => {
    this.color = false;
    svgTag.removeEventListener('mousemove', mouseListener)
  });

  svgTag.addEventListener('touchstart', (e) => {
    this.color = this.pickedColor;
    touchListener(e)
  });

  svgTag.addEventListener('touchend', () => {
    this.color = false;
  });

  svgTag.addEventListener('touchmove', touchListener);

  this.svgTag = svgTag;
  this.container.appendChild(svgTag);
  return svgTag;
};

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
 * Generate the SVG map from the information
 * of the instance. An optional boolean is available
 * to generate a clean SVG to produce a lightweight
 * SVG (used for export)
 * 
 * @param boolean isClean To produce a clean SVG
 * @return SVGDOMElement The artwork
 */
Triangulr.prototype.generateSVG = function (isClean) {
  var i, data, points, polygon;
  var svgTag = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  svgTag.setAttribute('version', '1.1');
  svgTag.setAttribute('preserveAspectRatio', 'xMinYMin slice');

  if (this.isLandscape) {
    svgTag.setAttribute('width', this.mapWidth * this.triangleWidth);
    svgTag.setAttribute('height', this.mapHeight * this.triangleHeight);
    svgTag.setAttribute('viewBox', '0 0 ' + (this.mapWidth * this.triangleWidth) + ' ' + (this.mapHeight * this.triangleHeight));
  }
  else {
    svgTag.setAttribute('width', this.mapWidth * this.triangleHeight);
    svgTag.setAttribute('height', this.mapHeight * this.triangleWidth);
    svgTag.setAttribute('viewBox', '0 0 ' + (this.mapWidth * this.triangleHeight) + ' ' + (this.mapHeight * this.triangleWidth));
  }

  for(i in this.exportData) {
    data = this.exportData[i];
    if (isClean && !data.color) {
      continue;
    }
    polygon = document.createElementNS('http://www.w3.org/2000/svg','path');
    points   = 'M' + data.points[0].x + ' ' + data.points[0].y + ' ';
    points  += 'L' + data.points[1].x + ' ' + data.points[1].y + ' ';
    points  += 'L' + data.points[2].x + ' ' + data.points[2].y + ' Z';
    polygon.setAttribute('d', points);
    polygon.setAttribute('fill', data.color || this.BLANK_COLOR);
    polygon.setAttribute('rel', i);
    svgTag.appendChild(polygon);
  }
  return svgTag;
}



Triangulr.prototype.exportSVG = function () {
  return this.generateSVG(true).outerHTML;
};

Triangulr.prototype.export = function () {
  return {
    isLandscape: this.isLandscape,
    mapWidth: this.mapWidth,
    mapHeight: this.mapHeight,
    mapData: this.exportData.map(function (e) {return e.color || null}),
    triangleWidth: this.triangleWidth,
    palette: this.palette
  };
};


Triangulr.prototype.import = function (data) {
  this.setCanvas(
    data.mapWidth,
    data.mapHeight,
    data.triangleWidth,
    data.isLandscape
  );

  this.palette = data.palette || []

  for (var i in data.mapData) {
    this.exportData[i].color = data.mapData[i];
  }

  for (var i = 0; i < this.svgTag.childNodes.length; i++) {
    this.svgTag.childNodes[i].setAttribute('fill', this.exportData[i].color || this.BLANK_COLOR);
  }
};




Triangulr.prototype.loadWorkspaceFromFile = function (data) {
  console.log('loadWorkspaceFromFile', data)
  this.import(data)
  this.workspace = storage.createItem('imported file')
  storage.updateItem(this.workspace.id, this.export())
  return true
}
Triangulr.prototype.loadWorkspaceFromStorage = function (id) {
  console.log('loadWorkspaceFromStorage', id)
  this.workspace = {id}
  this.import(storage.getItem(id))
  return true
}
Triangulr.prototype.newWorkspace = function (data) {
  console.log('newWorkspace', data)
  this.setCanvas(data.width, data.height, 30, data.isLandscape);
  this.workspace = storage.createItem(data.name || 'untitled')
  storage.updateItem(this.workspace.id, this.export())
  return true
}

Triangulr.prototype.save = function () {
  storage.updateItem(this.workspace.id, this.export())
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
};


Triangulr.prototype.updateCurrentColor = function (color) {
  this.pickedColor = color;
};

Triangulr.prototype.eraseMode = function () {
  this.pickedColor = null;
};

Triangulr.prototype.toggleEditing = function () {
  this.isEditing = !this.isEditing
  return this.isEditing
}

Triangulr.prototype.addColor = function (color) {
  if (!color || this.palette.indexOf(color) !== -1) {
    return;
  }
  this.palette.push(color);
};

export default Triangulr
