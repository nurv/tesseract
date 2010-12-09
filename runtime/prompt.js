/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2010 by Artur Ventura
 *
 * File: prompt.js
 * Time-stamp: Sat Dec 09 10:09:00 2010
 *
 * Author: Artur Ventura
 */

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