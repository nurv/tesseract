(function(){
	function prompt(){
		if(tesseract.config.canWrite){
			return tesseract.color.bg("red") + "tes *Write Mode ON*>" + tesseract.color.reset() + " ";
		}else{
			return "tes> ";
		}
	}
	tesseract.config.prompt = prompt;
})()