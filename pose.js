const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

async function setupCamera() {
    if (!navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
    }
    video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
    return new Promise(resolve => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function loadPoseNet() {
    const net = await posenet.load();
    return net;
}

function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
    keypoints.forEach(point => {
        if (point.score >= minConfidence) {
            const { y, x } = point.position;
            ctx.beginPath();
            ctx.arc(x * scale, y * scale, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'aqua';
            ctx.fill();
        }
    });
}

async function detectPoseInRealTime(video, net) {
    async function poseDetectionFrame() {
        const pose = await net.estimateSinglePose(video, {
            flipHorizontal: false
        });
        console.log(pose);

        ctx.clearRect(0, 0, video.width, video.height);
        drawKeypoints(pose.keypoints, 0.6, ctx);
        requestAnimationFrame(poseDetectionFrame);
    }
    poseDetectionFrame();
}

async function run() {
    await setupCamera();
    video.play();
    const net = await loadPoseNet();
    detectPoseInRealTime(video, net);
}

run();
