function writeOn(){
	tesseract.config.canWrite = true;
}

function writeOff(){
	tesseract.config.canWrite = false;
}

function toogleWrite(){
	tesseract.config.canWrite = !tesseract.config.canWrite;
}