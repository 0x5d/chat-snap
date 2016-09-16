$(function () {
  'use strict'

  const id = getChatId()
  if (id === '') {
    window.location = '/'
  }

  let socket = io.connect()
  socket.emit('enter', id)

  // Get access to the camera!
  const options = { video: true }
  // Try to use latest API.
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(options)
      .then(initVideo)
      .catch(handleError)
  } else {
    // Fall back to deprecated API if available.
    navigator.getUserMedia = navigator.getUserMedia || 
                             navigator.webkitGetUserMedia || 
                             navigator.mozGetUserMedia
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
    let video = document.getElementById('video')
    video.src = window.URL.createObjectURL(stream)
    video.play()
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
      .catch(handleError)
  }

  function createCanvasFrom (image) {
    let imgCanvas = document.createElement('canvas')
    imgCanvas.width = image.width
    imgCanvas.height = image.height
    imgCanvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height)
    return imgCanvas
  }

  function renderImageElement (canvas, source) {
    let row = $('<div></div>')
    row.addClass('row')

    let imgContainer = $('<div></div>')
    imgContainer.addClass('small-4 columns ' + source)
    imgContainer.appendTo(row)

    $(canvas).appendTo(imgContainer)

    if (source === 'me') {
      let fill = $('<div></div>')
      fill.addClass('small-8 columns')
      fill.prependTo(row)
    }
    row.appendTo('#feed')
    row.get(0).scrollIntoView()
  }

  function getChatId() {
    let id = ''
    window.location.search.replace(/[?&]+id=([^&]*)/, function (m, value) {
      id = value
    })
    return id
  }

  function handleError (err) {
    alert('Something happened. Try again, maybe? :)')
    console.error(err)
  }
})
