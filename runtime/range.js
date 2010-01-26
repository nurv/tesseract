/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2010 by Artur Ventura
 *
 * File: range.js
 * Time-stamp: Sat Jan 23 17:37:00 2010
 *
 * Author: Artur Ventura
 */

(function(){
    range = function (lower,upper,step){
	return new range.fn.init(lower,upper,step);
    }
    range.fn = range.prototype = {
	init:function (lower,upper,step){
	    if(!upper){
		if (lower > 0){
		    this.upper = lower;
		    this.lower = 0;
		}else{
		    this.upper = 0;
		}
	    }else{
		this.upper = upper;
		this.lower = lower;
	    }
	    this.step = step || 1;
	    
	},
	map:function(clojure){
	    var val = [];
	    for(var i = this.lower; i < this.upper; i += this.step){
		val.push(clojure(i));
	    }
	    return val;
	},
	toArray:function(cl){
	    return this.map(function(i){return i});
	},
	toString:function(){
	    var x = "[range: [" + this.lower + ", " + this.upper  + "[";
	    if(this.step){
		x += " by " + this.step;
	    }
	    return x + "]";
	}
    }
    range.fn.init.prototype = range.fn;
})()