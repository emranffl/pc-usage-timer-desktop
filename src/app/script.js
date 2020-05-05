
const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)

  const timer = document.getElementById('timer') // holds HTML time display

  let timerObj = null, // timer object
    currentTime = 0 // current time


  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    const resizedDetections = faceapi.resizeResults(detections, displaySize)

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)

    if (detections.length != 0 && detections[0]._score > 0.5) {

      // Calculate hours, mins, seconds
      currentTime++
      var remain = currentTime
      var hours = Math.floor(remain / 3600)
      remain -= hours * 3600
      var mins = Math.floor(remain / 60)
      remain -= mins * 60
      var secs = remain

      // Update the display timer
      if (hours < 10) { hours = "0" + hours; }
      if (mins < 10) { mins = "0" + mins; }
      if (secs < 10) { secs = "0" + secs; }
      timer.innerHTML = hours + ":" + mins + ":" + secs;
    }
  }, 1000)
})