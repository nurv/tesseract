/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2010 by Artur Ventura
 *
 * File: stringFix.js
 * Time-stamp: Sat Dec 09 10:09:00 2010
 *
 * Author: Artur Ventura
 */

String.prototype.contains = function(s){
    return this.indexOf(s) != -1;
};

String.prototype.beginsWith = function(s){
    return this.indexOf(s) == 0;
};

String.prototype.endsWith = function(s){
    return this.indexOf(s) == this.length - s.length;
};