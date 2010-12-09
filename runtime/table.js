/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2010 by Artur Ventura
 *
 * File: table.js
 * Time-stamp: Sat Dec 09 10:10:00 2010
 *
 * Author: Artur Ventura
 */

(function() {
    function clone(obj) {
		var newObj = (obj instanceof Array) ? [] : {};
		for (i in obj) {
			if (obj[i] && typeof obj[i] == "object") {
				newObj[i] = clone(obj[i]);
				} else newObj[i] = obj[i]
		  } 
		return newObj;
	};
	
	function getValue(item, thing, index) {
		if (!thing) {
			return item
		} else if ((typeof thing) === "string") {
			if (item[thing]) {
				if ((typeof item[thing]) === "function") {
					return item[thing]();
				} else {
					return item[thing]
				}
			} else {
				return item[tesseract.utils.getter(thing)]()
			}
		} else {
			return thing(item, index);
		}
	}
	
	Table = function(objects) {
		return new Table.fn.init(objects);
	}
	Table.fn = Table.prototype = {
		init : function(objects,options) {
			this.objects = objects;
			this.options = options || {highlight:[],headers:null, index:false, noHeader:false};
		},
		col : function(name,slotOrFunc) {
		    	var x = clone(this.options);
		    	if (!x.headers){
		    	    x.headers = [];
		    	}
				if (slotOrFunc){
					if (typeof slotOrFunc === "string"){
					    x.headers = x.headers.concat([{label:name,slot:slotOrFunc}]);
					    return new Table.fn.init(this.objects,x);
					}else{
                        x.headers = x.headers.concat([{label:name,func:slotOrFunc}]);   
					    return new Table.fn.init(this.objects,x);
					}
				}else{
                    x.headers = x.headers.concat([name]);   
				    return new Table.fn.init(this.objects,x);
				}
		},
		cols : function(names) {
		    	var x = clone(this.options);
		    	if (!x.headers){
		    	    x.headers = [];
		    	}
                x.headers = x.headers.concat(names);
				return new Table.fn.init(this.objects,x);
		},
		all: function(){
            importClass(Packages.pt.ist.fenixframework.FenixFramework);
            var types = from(this.objects).types().toArray()
            var slots = new java.util.HashSet();
            var relations = new java.util.HashSet();
            for (var i= 0; i < types.length; i++){
                var clazz = types[i];
                map(FenixFramework.getDomainModel().findClass(clazz).getSlotsList(), function(o){
                    slots.add(o.getName());
                });
                map(FenixFramework.getDomainModel().findClass(clazz).getRoleSlotsList(), function(o){
                   relations.add([clazz,o]); 
                });
            }
            var efSlots = map(slots,function(o){
                return {label:o,func:function(x){ 
                    if ( x[tesseract.utils.getter(o)] ) {
                        return x[tesseract.utils.getter(o)]()
                    } else { 
                        return "<N/A>" 
                    } 
                }
              }
            });
            var efRel = map(relations,function(v){
                var r = v[1];
                var clazz = v[0];
                var x = "" + r.getName();
                return {label:x,func:function(o){
                    if (o.getClass().getName().equals(clazz)) {
                    if (r.getMultiplicityUpper() == 1) {
    					var k = o[tesseract.utils.getter(x)]()
    					var xinobi;
    					if (k == null) {
    						xinobi = "<null>"
    					} else {
    						xinobi = k.getClass().getSimpleName() + "(";
    						if (k.getExternalId) {
    							xinobi = xinobi + k.getExternalId();
    						} else {
    							xinobi = xinobi + k.getOid()
    						}
    						xinobi += ")";
    					}

    				} else {
    					xinobi = "" + r.getType().getName() + "(<lenght: "
    							+ o[tesseract.utils.getter(x)]().size() + ">)";
    				}
    				return xinobi;
                } else {
                    return "<N/A>";
                }}
                };
            });
            return this.cols(["oid"].concat(efSlots.concat(efRel)));
		},
		indexed: function(){
		    var x = clone(this.options);
		    x.index = true;
			return new Table.fn.init(this.objects,x);
		},
		noHeaders: function(){
		    var x = clone(this.options);
		    x.noHeader = true;
			return new Table.fn.init(this.objects,x);
		},
		vl: function(){
		    var x = clone(this.options);
		    x.verticalLayout = true;
			return new Table.fn.init(this.objects,x);
		},
		hl: function(func,bg,fg){
		    var x = clone(this.options);
		    if (!bg && !fg) { bg = "red"; }
            x.highlight = x.highlight.concat([[func,fg,bg]]);
			return new Table.fn.init(this.objects,x);
		},
		toString: function(){
		    function verticalLayout(){
    		    var he = this.options.headers;
    		    var headers = he || [ "toString" ];
    		    var theResult = "";
    		    var maxColumns = 0;
    		    headers.map(function(line){
    		        if (typeof line === "string"){
    		            maxColumns = Math.max(line.length, maxColumns);
    	            }else{
    	                maxColumns = Math.max(line.label.length, maxColumns);
    	            }
    		    });
    		    var format =  "%1$" + maxColumns + "s: ";
    		    var that = this;
                var func = function(o,i){
    		        var colors;
    		        if (that.options.highlight) {
        			    for (var j=0; j < that.options.highlight.length; j++) {
            				if (that.options.highlight[j][0](o)) {
            					colors = [ that.options.highlight[j][1],
            							that.options.highlight[j][2] ];
            				}
        			    }
        			}
        			if (colors) { theResult += tesseract.color.color(colors[0]) + tesseract.color.bg(colors[1])}
        			theResult += "*************************** " + i + ". row ***************************" 
                    if (colors) { theResult += tesseract.color.reset() }
        			theResult += "\n";
        			headers.map(function (h){
        			    if (h.label) {
                            theResult += (new java.util.Formatter()).format(format, "" + h.label).toString();
        					theResult += getValue(o, h.slot || h.func, i) + "\n";
        				} else {
        				    theResult += (new java.util.Formatter()).format(format, "" + h).toString();
        					theResult += getValue(o, h, i) + "\n";
        				}
                    })
    		    }
    		    if (this.objects.map){
        		    this.objects.map(func);
        		}else{
        		    map(this.objects, func);  
        		}
                return theResult;
    		}
    		if (this.options.verticalLayout) { return verticalLayout.call(this) }
		    var he = this.options.headers;
		    var opts = this.options;
    		if (he && !(typeof (he) === 'object' && he.constructor == Array)) {
    			he = [ he ];
    		}
    		var headers = he || [ "toString" ];
    		var highlight = {};
    		var func = function(o, i) {
    			var val = headers.map(function(h) {
    				if (h.label) {
    					return getValue(o, h.slot || h.func, i);
    				} else {
    					return getValue(o, h, i);
    				}
    			});

    			if (opts.highlight) {
    			    for (var j=0; j < opts.highlight.length; j++) {
        				if (opts.highlight[j][0](o)) {
        					highlight[i] = [ opts.highlight[j][1],
        							opts.highlight[j][2] ];
        				}
    			    };

    			}

    			if (opts.index) {
    				return [ i ].concat(val);
    			} else {
    				return val;
    			}
    		};
    		var table;
    		if (this.objects.map){
    		    table = this.objects.map(func);
    		}else{
    		    table = map(this.objects, func);  
    		} 
    		headers = headers.map(function(h) {
    			if ((typeof h) == "string") {
    				return h;
    			} else {
    				return h.label;
    			}
    		});

    		if (opts.index) {
    			headers = [ "#" ].concat(headers);
    		}
    		if (!opts.noHeader && he) {
    			return tesseract.utils.generateTable(table, highlight, headers);
    		} else {
    			return tesseract.utils.generateTable(table, highlight);
    		}
    	}
	}
	Table.fn.init.prototype = Table.fn;
})()