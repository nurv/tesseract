/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2010 by Artur Ventura
 *
 * File: writeMode.js
 * Time-stamp: Sat Dec 09 10:10:00 2010
 *
 * Author: Artur Ventura
 */

function writeOn(){
	tesseract.config.canWrite = true;
}

function writeOff(){
	tesseract.config.canWrite = false;
}

function toogleWrite(){
	tesseract.config.canWrite = !tesseract.config.canWrite;
}

function writeMode(v){
	if(arguments.length > 0){
		tesseract.config.canWrite = v;
	}
	return tesseract.config.canWrite;
}

function withWriteOn(fn){
	var previousWriteMode = writeMode();
	writeOn();
	fn();
	writeMode(previousWriteMode);
}
