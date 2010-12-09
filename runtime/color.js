/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2010 by Artur Ventura
 *
 * File: color.js
 * Time-stamp: Sat Dec 09 10:09:00 2010
 *
 * Author: Artur Ventura
 */

(function() {
	function getColorCode(color) {
		var c;
		switch (color) {
		case "black":
			c = 0;
			break;
		case "red":
			c = 1;
			break;
		case "green":
			c = 2;
			break;
		case "yellow":
			c = 3;
			break;
		case "blue":
			c = 4;
			break;
		case "magenta":
			c = 5;
			break;
		case "cyan":
			c = 6;
			break;
		default:
			c = 7;
			break;
		}
		return c;
	}
	tesseract.color = {
		color : function(color) {
			return "\u001b[1;3" + getColorCode(color) + "m";
		},
		bg : function(color) {
			return "\u001b[1;4" + getColorCode(color) + "m";
		},
		reset : function() {
			return "\u001b[m";
		}
	}
})()