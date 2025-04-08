const imageInput = document.getElementById('image-input');
const compressRange = document.getElementById('compress-range');
const compressValue = document.getElementById('compress-value');
const compressButton = document.getElementById('compress-button');
const outputContainer = document.getElementById('output-container');
const outputImage = document.getElementById('output-image');
const originalSize = document.getElementById('original-size');
const compressedSize = document.getElementById('compressed-size');
const downloadLink = document.getElementById('download-link');

// Update compression percentage value
compressRange.addEventListener('input', () => {
    compressValue.textContent = compressRange.value;
});

compressButton.addEventListener('click', () => {
    const file = imageInput.files[0];

    if (!file) {
        alert('Please select an image file.');
        return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
        const imageDataURL = event.target.result;
        const image = new Image();

        image.onload = () => {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;

            // Draw the image on the canvas
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);

            // Get the compression quality from the slider
            const quality = compressRange.value / 100;

            // Convert canvas content to compressed image
            const compressedDataURL = canvas.toDataURL('image/jpeg', quality);

            // Display the compressed image
            outputImage.src = compressedDataURL;
            outputContainer.classList.remove('hidden');

            // Calculate and display original and compressed sizes
            const originalSizeBytes = file.size;
            const compressedSizeBytes = Math.round((compressedDataURL.length * 3) / 4); // Approximate size in bytes
            originalSize.textContent = formatBytes(originalSizeBytes);
            compressedSize.textContent = formatBytes(compressedSizeBytes);

            // Set up the download link
            downloadLink.href = compressedDataURL;
            downloadLink.download = `compressed-image.jpg`;
        };

        image.src = imageDataURL;
    };

    reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert('Error reading file. Please try again.');
    };

    reader.readAsDataURL(file);
});

// Helper function to format bytes into KB or MB
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals) + ' ' + sizes[i]);
}