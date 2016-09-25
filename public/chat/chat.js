$(() => {

  const id = window.location.search.substring(1).split('=')[1]

  if (!id || id === '') {
    window.location = '/'
    return
  }

  const socket = io.connect()
  const video = document.getElementById('video')

  socket.on('file', processFile)
  socket.emit('enter', id)
  initVideo()
  // Trigger photo
  $('#snap').on('click', snap)


  function initVideo () {
    // Get access to the camera!
    const options = { video: true }
    // Try to use latest API.
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(options)
        .then(initPreview)
        .catch(handleError)
    } else {
      // Fall back to deprecated API if available.
      navigator.getUserMedia = navigator.getUserMedia || 
                               navigator.webkitGetUserMedia || 
                               navigator.mozGetUserMedia
      if (navigator.getUserMedia) {
        navigator.getUserMedia(options, initPreview, handleError)
      } else {
        alert("Sorry, your browser doesn't support video :(")
      }
    }
  }

  function initPreview (stream) {
    video.src = window.URL.createObjectURL(stream)
    video.play()
  }

  function snap () {
    let newImageCanvas = createCanvasFrom(video)
    renderImageElement(newImageCanvas, 'me')
    newImageCanvas.toBlob(blob => socket.emit('file', blob))
  }

  function processFile (arrayBuffer) {
    let imageBlob = new Blob([arrayBuffer])
    createImageBitmap(imageBlob)
      .then(image => {
        let newImageCanvas = createCanvasFrom(image)
        renderImageElement(newImageCanvas, 'them')
      })
      .catch(handleError)
  }

  function createCanvasFrom (media) {
    let imgCanvas = document.createElement('canvas')
    imgCanvas.width = media.width
    imgCanvas.height = media.height
    imgCanvas.getContext('2d').drawImage(media, 0, 0, media.width, media.height)
    return imgCanvas
  }

  function renderImageElement (canvas, source) {
    let $row = $('<div></div>')
    $row.addClass('row')

    let $imgContainer = $('<div></div>')
    $imgContainer.addClass(`small-4 columns ${source}`)
    $imgContainer.appendTo($row)

    $(canvas).appendTo($imgContainer)

    if (source === 'me') {
      let $fill = $('<div></div>')
      $fill.addClass('small-8 columns')
      $fill.prependTo($row)
    }
    $row.appendTo('#feed')
    $row.get(0).scrollIntoView()
  }

  function handleError (err) {
    alert('Something happened. Try again, maybe? :)')
    console.error(err)
  }
})
