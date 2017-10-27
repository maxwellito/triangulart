function Toolbar (playground) {
  this.playground = playground;
  this.colorInput = document.getElementById('color-picker');
  this.colorList  = document.getElementById('color-list');
  this.outlineStyle = document.getElementById('outline-style');
  this.isOutlineOn = true;
  this.palette = [];

  // Create the input file to load configs
  this.inputLoader = document.createElement('input');
  this.inputLoader.type = 'file';
  this.inputLoader.onchange = this.loadConfig.bind(this);
  this.inputLoader.style = 'display: none';
  document.body.appendChild(this.inputLoader);

  // Create the 'a' tag to download
  this.downloadAnchor = document.createElement('a');
  this.downloadAnchor.style = 'display: none';
  document.body.appendChild(this.downloadAnchor);
}

Toolbar.prototype.load = function () {
  var evt = document.createEvent('MouseEvents');
  evt.initEvent('click', true, false);
  this.inputLoader.dispatchEvent(evt);
};

Toolbar.prototype.loadConfig = function (e) {
  var files = this.inputLoader.files;
  var file = files[0];
  var confReader = new FileReader();

  confReader.addEventListener('load', function(event) {
    var textFile = event.target;
    var config = JSON.parse(textFile.result);
    this.setConfig(config);
  }.bind(this));

  //Read the text file
  confReader.readAsText(file);
};

Toolbar.prototype.setConfig = function (config) {
  // Set colors
  this.palette.innerHTML = '';
  config.palette.forEach(function (color) {
    this.addColor(color);
  }.bind(this));

  this.playground.import(config.playground);
};


Toolbar.prototype.save = function () {
  var output = {
    playground: this.playground.export(),
    palette: this.palette
  };
  this.saveFile(JSON.stringify(output), 'artwork.json');
};

Toolbar.prototype.exportSVG = function () {
  this.saveFile(this.playground.exportSVG(), 'artwork.svg');
};

/**
 * From http://jsfiddle.net/koldev/cw7w5/
 * >> +1 Good Job!
 */
Toolbar.prototype.saveFile = function (data, fileName) {
    var blob = new Blob([data], {type: 'octet/stream'}),
        url = window.URL.createObjectURL(blob);
    this.downloadAnchor.href = url;
    this.downloadAnchor.download = fileName;
    this.downloadAnchor.click();
    window.setTimeout(function () {
      window.URL.revokeObjectURL(url);
    }, 10);
};



Toolbar.prototype.colorButtonListener = function (e) {
  this.playground.currentColor = this.playground.pickedColor = this.colorInput.value = e.target.getAttribute('rel');
};

Toolbar.prototype.updateCurrentColor = function (e) {
  this.playground.currentColor = this.playground.pickedColor = this.colorInput.value;
};

Toolbar.prototype.eraseMode = function (e) {
  this.playground.currentColor = null;
};

Toolbar.prototype.penMode = function (e) {
  this.playground.currentColor = this.playground.pickedColor;
};

Toolbar.prototype.addColor = function (color) {
  color = color || this.colorInput.value;
  if (this.palette.indexOf(color) !== -1) {
    return;
  }
  var newColor = document.createElement('button');
  newColor.style.backgroundColor = color;
  newColor.setAttribute('rel', color);
  newColor.onclick = this.colorButtonListener.bind(this);
  this.colorList.appendChild(newColor);
  this.palette.push(color);
};

Toolbar.prototype.toggleOutline = function () {
  if (this.isOutlineOn) {
    this.outlineStyle.textContent = '.playground path {stroke: none;}';
  }
  else {
    this.outlineStyle.textContent = '.playground path {stroke: currentColor;}';
  }
  this.isOutlineOn = !this.isOutlineOn;
}
