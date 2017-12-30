let downloadAnchor = document.createElement('a')
downloadAnchor.style.display = 'none'
document.body.appendChild(downloadAnchor)

/**
 * From http://jsfiddle.net/koldev/cw7w5/
 * >> +1 Good Job!
 */
let downloader = function (data, fileName) {
  let blob = new Blob([data], {type: 'octet/stream'}),
      url = window.URL.createObjectURL(blob)
  downloadAnchor.href = url
  downloadAnchor.download = fileName
  downloadAnchor.click()
  window.setTimeout(function () {
    window.URL.revokeObjectURL(url)
  }, 10)
}

export default downloader