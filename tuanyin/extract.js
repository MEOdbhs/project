const fs = require('fs');
const path = require('path');
const cv = require('opencv.js');

async function main() {
    console.log('Loading opencv...');
    // In Node.js environment we need to wait for cv to be ready
    if (!cv.Mat) {
        await new Promise(resolve => {
            cv.onRuntimeInitialized = resolve;
        });
    }

    const assetsDir = path.join(__dirname, 'assets');
    const bgPath = path.join(assetsDir, 'all.jpg');
    
    // Unfortunately, reading 15000x14000 image in JS memory might crash Node.js or opencv.js
    // So let's write a python script for template matching, which is much more stable with C++ backend
    console.log('Use python cv2 instead.');
}

main().catch(console.error);
