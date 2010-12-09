/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2010 by Artur Ventura
 *
 * File: time.js
 * Time-stamp: Wed Jan 20 14:02:42 2010
 *
 * Author: Artur Ventura
 */

function withTime(expression){
    var start = Packages.java.lang.System.currentTimeMillis();
    var result = expression();
    var end = Packages.java.lang.System.currentTimeMillis() - start;
    if (!(result === undefined)){ print(result) };
    print("in " + end/1000 + " secs.\n\n");
}
