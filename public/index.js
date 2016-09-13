(function(){// Grab elements, create settings, etc.
  'use strict'

  let video = document.getElementById('video')
  let canvas = document.getElementById('canvas')
  let context = canvas.getContext('2d')

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
  document.getElementById('snap').addEventListener('click', snap)

  socket.on('file', processFile)

  function initVideo (stream) {
    video.src = window.URL.createObjectURL(stream)
    video.play()
  }

  function handleError (err) {
    alert('Something happened. Try again, maybe? :)')
  }

  function snap () {
    context.drawImage(video, 0, 0, 640, 480)
    canvas.toBlob(function emitBlob (blob) {
      socket.emit('file', blob)
    })
  }

  function processFile (arrayBuffer) {
    var blob = new Blob([arrayBuffer])
    createImageBitmap(blob)
      .then(function drawImage (image) {
        context.drawImage(image, 0, 0, 320, 240)
      })
      .catch(function handleImageError () {
        alert('Something happened. Try again, maybe? :)')
      })
  }
})()