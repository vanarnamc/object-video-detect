const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

async function setupCamera() {
    if (!navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
    }
    video.srcObject = await navigator.mediaDevices.getUserMedia({ video: {} });
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function run() {
    await setupCamera();
    video.play();

    // Load the face-api.js models
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector_model-shard1');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68_model-shard1');
    // await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

    // Detect faces
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, { width: video.width, height: video.height });
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    }, 100);
}

run();
