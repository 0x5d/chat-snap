(function(){// Grab elements, create settings, etc.
  'use strict'

  let video = document.getElementById('video')
  let canvas = document.getElementById('canvas')
  let context = canvas.getContext('2d')

  let socket = io.connect()

  // Get access to the camera!
  if(Modernizr.getusermedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(initVideo)
      .catch(handleError)
  } else {
    alert("Sorry, your browser doesn't support video :(")
  }

  function initVideo (stream) {
    video.src = window.URL.createObjectURL(stream)
    video.play()
  }

  function handleError (err) {
    alert("Something happened. Try again, maybe? :)")
  }

  // Trigger photo
  document.getElementById("snap").addEventListener("click", function() {
    context.drawImage(video, 0, 0, 640, 480)
    canvas.toBlob(function (blob) {
      socket.emit('file', blob)
    })
  })


  socket.on('file', function (arrayBuffer) {
    var blob = new Blob([arrayBuffer])
    createImageBitmap(blob).then(function(image){
      context.drawImage(image, 0, 0, 320, 240)
    })
  })
})()