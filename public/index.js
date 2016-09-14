$(function(){// Grab elements, create settings, etc.
  'use strict'

  let video = document.getElementById('video')

  let socket = io.connect()

  // Get access to the camera!
  const options = { video: true }
  // Try to use latest API.
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(options)
      .then(initVideo)
      .catch(handleError)
  } else {
    // Fall back to deprecated API if available.
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia(options, initVideo, handleError)
    } else {
      alert("Sorry, your browser doesn't support video :(")
    }
  }

  // Trigger photo
  $('#snap').on('click', snap)

  socket.on('file', processFile)

  function initVideo (stream) {
    video.src = window.URL.createObjectURL(stream)
    video.play()
  }

  function handleError (err) {
    alert('Something happened. Try again, maybe? :)')
  }

  function snap () {
    let newImageCanvas = createCanvasFrom(video)
    renderImageElement(newImageCanvas, 'me')
    newImageCanvas.toBlob(function emitBlob (blob) {
      socket.emit('file', blob)
    })
  }

  function processFile (arrayBuffer) {
    var blob = new Blob([arrayBuffer])
    createImageBitmap(blob)
      .then(function drawImage (image) {
        let newImageCanvas = createCanvasFrom(image)
        renderImageElement(newImageCanvas, 'them')
      })
      .catch(function handleImageError () {
        alert('Something happened. Try again, maybe? :)')
      })
  }

  function createCanvasFrom (image) {
    let imgCanvas = document.createElement('canvas')
    imgCanvas.width = image.width
    imgCanvas.height = image.height
    imgCanvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height)
    return imgCanvas
  }

  function renderImageElement (canvas, htmlClass) {
    let container = $('<div></div>')
    if (htmlClass) {
      container.addClass(htmlClass)
    }
    $(canvas).appendTo(container)
    container.appendTo('#feed')
  }
})
