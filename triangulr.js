'use strict';

/**
 * Triangulr class
 * instructions will follow, in an other commit, it's late now
 *
 * @param	string					containerId			Container DOM id
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
 * @param	int							width						Triangle height
 * @param	int							height					Triangle height
 * @param	int							triangleHeight	Triangle height
 */
Triangulr.prototype.setCanvas = function (width, height, triangleWidth, isLandscape) {
	// Save input
	this.isLandscape = isLandscape;
	this.mapWidth = width;
	this.mapHeight = height;

	this.triangleWidth = triangleWidth;
	this.triangleHeight = Math.sqrt(Math.pow(triangleWidth, 2) - Math.pow(triangleWidth / 2, 2));
	this.triangleHeight = Math.round(this.triangleHeight);

	this.lines = [];
	this.exportData = [];
	this.pickedColor = this.DEFAULT_COLOR;

	this.lineMapping();
	this.createTriangles();
	this.generateDom();
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

	var i, j, data, points, polygon;
	var svgTag = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	var output = '';

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

	this.color = false;
	svgTag.addEventListener('mousedown', function (e) {
		this.color = this.pickedColor;
		listener(e);
	}.bind(this));
	window.addEventListener('mouseup', function () {
		this.color = false;
	}.bind(this));

	var listener = function (e) {
		var rel = parseInt(e.target.getAttribute('rel'), 10);
		if (this.color === false || isNaN(rel)) {
			return;
		}
		this.exportData[rel].color = this.color;
		e.target.setAttribute('fill', this.color || this.BLANK_COLOR);
	}.bind(this);

	for(i in this.exportData) {
		data = this.exportData[i];
		polygon = document.createElementNS('http://www.w3.org/2000/svg','path');
		points   = 'M' + data.points[0].x + ' ' + data.points[0].y + ' ';
		points  += 'L' + data.points[1].x + ' ' + data.points[1].y + ' ';
		points  += 'L' + data.points[2].x + ' ' + data.points[2].y + ' Z';
		polygon.setAttribute('d', points);
		polygon.setAttribute('fill', data.color || this.BLANK_COLOR);
		polygon.setAttribute('rel', i);
		polygon.addEventListener('mousemove', listener);

		svgTag.appendChild(polygon);
	}

	this.svgTag = svgTag;
	this.container.appendChild(svgTag);
	return svgTag;
};

Triangulr.prototype.export = function () {
	return {
		isLandscape: this.isLandscape,
		mapWidth: this.mapWidth,
		mapHeight: this.mapHeight,
		mapData: this.exportData.map(function (e) {return e.color || null}),
		triangleWidth: this.triangleWidth
	};
};


Triangulr.prototype.import = function (data) {
	this.setCanvas(
		data.mapWidth,
		data.mapHeight,
		data.triangleWidth,
		data.isLandscape
	);

	for (var i in data.mapData) {
		this.exportData[i].color = data.mapData[i];
	}

	for (var i = 0; i < this.svgTag.childNodes.length; i++) {
		this.svgTag.childNodes[i].setAttribute('fill', this.exportData[i].color || this.BLANK_COLOR);
	}
};

Triangulr.prototype.exportSVG = function () {
	return this.svgTag.outerHTML;
};



/**
 * WARNING!!!
 * The following code is a failing work in progress
 */
Triangulr.prototype.transformer = function () {
	var blob, pathObj, pathToMerge, lineIndex, pathIndex;
	var lineLength = this.mapWidth * 2 - 1;

	console.log('linelength: ', lineLength);

	for (var i = 1; i < this.exportData.length; i++) {
		pathObj = this.exportData[i];
		lineIndex = Math.floor(i / lineLength);
		pathIndex = i % lineLength;

		console.log(i);

		// Merge with the previous item ()
		if (pathIndex !== 0) {
			this.mergePath(this.exportData[i-1], pathObj)
		}

		// Merge with previous line path
		if (lineIndex && ((lineIndex % 2) !== (pathIndex % 2))) {
			console.log('Parite', lineIndex, pathIndex);
			this.mergePath(this.exportData[i - lineIndex], pathObj);
		}
	}
};

Triangulr.prototype.mergePath = function (blob, tri) {
	// Future check : the color
	if (!tri.color || tri.color !== blob.color) {
		return;
	}

	// If they are part of the same blob, it is le pointless
	if (tri.blob && tri.blob === blob.blob) {
		return;
	}

	console.log('Merge is happening');
	var blob = merger(blob.blob || blob.points, tri.points);
	tri.blob = blob;
	blob.blob = blob;
	debugger;
};

function merger (blob, tri) {
	var d = [
		blob.indexOf(tri[0]),
		blob.indexOf(tri[1]),
		blob.indexOf(tri[2]),
	];

	var pointsNotFound = d.filter(function(e){return e === -1}).length;

	if (pointsNotFound > 1) {
		console.error('Holy shite, we have a bug');
		debugger;
	}

	var iMax, iMin, newPoint;

	if (pointsNotFound == 0) {
		iMax = Math.max.apply(null, d);
		iMin = Math.min.apply(null, d);
		// Remove the middle point
		if (iMax - iMin > 2) {
			if (d.filter(function(x){return x === 1;}).length) {
				// Remove the first point
				blob.shift();
			}
			else {
				// Remove the last
				blob.pop();
			}
		}
		else {
			blob.splice(iMin + 1, 1);
		}
	}
	else {
		newPoint = tri[d.indexOf(-1)];
		d.splice(d.indexOf(-1), 1);
		iMax = Math.max.apply(null, d);
		iMin = Math.min.apply(null, d);
		// Add the new point

		if (iMin === 0 && (iMax === blob.length - 1)) {
			blob.push(newPoint);
		}
		else {
			blob.splice(iMax, 0, newPoint);
		}
	}

	return blob;
}
