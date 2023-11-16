// Global variables to store the original video dimensions
let originalVideoWidth;
let originalVideoHeight;

// Function to handle window resize
function handleResize() {
    const videoElement = document.getElementById('video1'); // Replace with your actual video element ID
    const canvasElement = document.getElementById('canvas1'); // Replace with your actual canvas element ID

    // Calculate new dimensions while maintaining aspect ratio
    const aspectRatio = originalVideoWidth / originalVideoHeight;
    const newWidth = videoElement.parentElement.offsetWidth; // Resize based on parent element's width
    const newHeight = newWidth / aspectRatio;

    // Update video and canvas dimensions
    videoElement.width = newWidth;
    videoElement.height = newHeight;
    canvasElement.width = newWidth;
    canvasElement.height = newHeight;

    // Redraw or reprocess frame if necessary
    // ...
}

// Function to load a video with a random starting time
async function loadVideo(videoElementId, videoSource) {
    const videoElement = document.getElementById(videoElementId);
    videoElement.src = videoSource;

    return new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
            const maxDuration = videoElement.duration;
            const randomTime = Math.random() * maxDuration;
            videoElement.currentTime = randomTime;
            resolve(videoElement);
        };
    });
}

// Function to run object detection on a video
async function runObjectDetection(videoElementId, canvasElementId, textElementId) {
    // Load the video with a random starting time
    const video = await loadVideo(videoElementId, 'videos/Shopping1957.mp4');
    
    // Load the coco-ssd model
    const model = await cocoSsd.load();
    
    // Get the canvas element for rendering detections
    const canvas = document.getElementById(canvasElementId);
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

  // Function to continuously render predictions
// Function to continuously render predictions
const renderPrediction = async () => {
    const predictions = await model.detect(video);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Clear existing text boxes
    const textContainer = document.getElementById(textElementId);
    textContainer.innerHTML = '';

    predictions.forEach(prediction => {
        const [x, y, width, height] = prediction.bbox;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);
        // ctx.fillRect(x, y, width, height);
        // Create a new div element for each prediction
        const textBox = document.createElement('div');
        textBox.classList.add('text-style');
        textBox.innerText = prediction.class.toUpperCase();

        // Measure the text size
        ctx.font = '20px Arial, sans-serif'; // Match this to your text box font size
        const textMetrics = ctx.measureText(textBox.innerText);
        const textWidth = textMetrics.width;
        const textHeight = 20; // Approximate height of the text

        // Calculate center position for the text box
        const centerX = x + width / 2;
        const centerY = y + height / 2;

        // Adjust for text size
        const textX = centerX - textWidth / 2;
        const textY = centerY - textHeight / 2;

        // Set the position of the text box
        textBox.style.position = 'absolute';
        textBox.style.left = `${textX}px`;
        textBox.style.top = `${textY}px`;

        // Append the text box to the text container
        textContainer.appendChild(textBox);
    });

    requestAnimationFrame(renderPrediction);
};


    // Start rendering predictions
    renderPrediction();
}

// Load and run object detection for all four videos
runObjectDetection('video1', 'canvas1', 'text1');
runObjectDetection('video2', 'canvas2', 'text2');
runObjectDetection('video3', 'canvas3', 'text3');
runObjectDetection('video4', 'canvas4', 'text4');
