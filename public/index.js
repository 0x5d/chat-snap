// Grab elements, create settings, etc.
var video = document.getElementById('video');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var socket = io.connect();

// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Not adding `{ audio: true }` since we only want video now
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    video.src = window.URL.createObjectURL(stream);
    video.play();
  });
}

// Trigger photo take
document.getElementById("snap").addEventListener("click", function() {
	context.drawImage(video, 0, 0, 640, 480);
  canvas.toBlob(function (blob) {
    socket.emit('file', blob);
  });
});


socket.on('file', function (arrayBuffer) {
  var blob = new Blob([arrayBuffer])
  createImageBitmap(blob).then(function(image){
	  context.drawImage(image, 0, 0, 320, 240);
  });
});