/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2010 by Artur Ventura
 *
 * File: autoComplete.js
 * Time-stamp: Sat Dec 09 10:09:00 2010
 *
 * Author: Artur Ventura
 */

(function() {
	function reverseParser(sect) {
		var size = 0;
		var paren = 0;
		for ( var i = sect.length - 1; i >= 0; i--) {
			var c = sect.charAt(i);
			if (c == ')' || c == '}' || c == '[') {
				paren++;
				size++;
			} else if (c == '(' || c == '{' || c == ']') {
				if (paren == 0) {
					break;
				} else {
					paren--;
					size++;
				}
			} else if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
					|| (c >= '0' && c <= '9') || c == '$' || c == ".") {
				size++;
			} else {
				break;
			}
		}
		return sect.length - size;
	}

	function complete(buffer, cursor) {
		var query;
		if (cursor) {
			query = buffer.substring(0, cursor);
		} else {
			query = buffer;
		}
		var separation = reverseParser(query);
		var subquery = query.substring(separation);
		if (subquery === "") {
			return scope();
		}
		var matching = "";
		if (subquery[subquery.length - 1] === ".") {
			subquery = subquery.substring(0, subquery.length - 1);
		} else if (subquery[subquery.length - 1] === ")"
				|| subquery[subquery.length - 1] === "]"
				|| subquery[subquery.length - 1] === "}") {
		} else if (subquery.lastIndexOf(".") > 0) {
			matching = subquery.substring(subquery.lastIndexOf(".") + 1);
			subquery = subquery.substring(0, subquery.lastIndexOf("."));
		} else {
			matching = subquery;
		}
		var result;
		try {
			result = eval(subquery);
		} catch (e) {
			result = {};
		}
		var autchung = objectKeys(result);
		if (!(matching === "")) {
			autchung = autchung.concat(scope());
		}
		var f = autchung.filter(function(o) {
			if (o.indexOf(matching) === 0) {
				return true;
			} else {
				return false;
			}
		}).map(function(o) {
			if (matching === "" || !(matching === subquery)) {
				return query.substring(0, separation) + subquery + "." + o;
			} else {
				return query.substring(0, separation) + o;
			}
		});
		return f;
	}
	tesseract.config.autoComplete = true;
	tesseract.config.autoCompleteFunction = complete;
})();
