/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2010 by Artur Ventura
 *
 * File: linq.js
 * Time-stamp: Wed Jan 21 14:02:42 2010
 *
 * Author: Artur Ventura
 */

(function() {
    $ = function(aList,X) {
        return new $.fn.init(aList,X);
    };
    
    function aList(){
    	return new java.util.ArrayList();	
    }
    function getValue(item, thing, index){
	if(! thing ){
	    return item
	}else if((typeof thing) === "string"){
	    if (item[thing]){
		if ((typeof item[thing]) === "function"){
		    return item[thing]();
		}else{
		    return item[thing]
		}
	    }else{
		return item[tes.util.getter(thing)]()
	    }
	}else{
	    return thing(item,index);
	}
    }
    
    $.fn = $.prototype = {
        init: function(list,X) {
	    if (list["map"]){
		var x = aList();
		list.map(function (o) { x.add(o) });
		list = x;
	    }else if (list && typeof(list) === 'object' && list.constructor == this.constructor) {
		list = list.items;
	    }
        this.items = list || aList();
	    this.actions = X || [];
        },
        
        toArray: function() {
	    return map(this.items,function(o) { return o });
	},
	
        toList: function() {
        	if (this.items.getClass() == Packages.pt.ist.fenixframework.pstm.RelationList){
        		var x = aList();
        		java.util.Collections.copyArray(this.items,x);
        		return x;
        	}else{
        		return this.items;
        	}
        },
	
        toString: function() {
	    var ops = "";

	    if (this.actions.length > 1)
		ops = this.actions.reduce(function(x,y){
		    return x + "$" + y
		}) + ", ";
	    if (this.actions.length == 1){
		ops =  this.actions[0] + ", ";
	    }
	    return "[query: " + ops + "size: " + this.items.size() + "]";
	},
	
        where: function(clause) {
            var item;
            var newArray = aList();

	    map(this.items, function(item,index){
		if (clause(item, index)) {
                    newArray.add(item);
                }
	    });
	    
            return new $(newArray,this.actions.concat(["where"]));
        },
	
        select: function(thing) {
            var item;
            var newArray = aList();
		map(this.items, function(item,index){
		    var val = getValue(item,thing,index);
            	    if (val) {
			newArray.add(val);
                    }
		});
            return new $(newArray,this.actions.concat(["select"]));
        },

	selectAll: function(thing) {
            var item;
            var newArray = aList();

	    map(this.items, function(item,index){
		var val = getValue(item,thing,index);
            	if (val) {
		    newArray.addAll(val);
		}
	    });
            return new $(newArray,this.actions.concat(["selectAll"]));
        },
	
	orderBy: function(clause) {
            var tempArray = aList();
	    java.util.Collections.copyArray(this.items,tempArray);
	    if (clause){
		java.util.Collections.sort(tempArray, new java.util.Comparator({
		    compare: clause,
		    equal:function () { return false; }
		}));
	    }else{
		java.util.Collections.sort(tempArray);
	    }
            return new $(tempArray,this.actions.concat(["orderBy"]));
	},
        distinct: function(thing) {
            var dict = new java.util.HashSet();
	    var result = aList();

            map(this.items, function(item, index){
		var val = getValue(item, thing, index);
                if (val != null && !dict.contains(val)) {
                    dict.add(val);
                    result.add(item);
                }

	    });
	    
            dict = null;
            return new $(result,this.actions.concat(["distinct"]));
        },
	count: function(clause) {
            if (clause == null)
                return this.items.size();
            else
                return this.where(clause).items.size();
        },
	any: function(clause) {
            return find(this.items,function(item){
                if (clause(item, index)) {
		    return val;
		}
            });
        },
	reverse: function() {
            var x =  aList();
            x.addAll(this.items);
	    java.util.Collections.reverse(x);
            return new $(x,this.actions.concat(["reverse"]));
        },
	first: function(clause) {
            if (clause != null) {
                return this.where(clause).first();
            }
            else {
                if (this.items.size() > 0)
                    return this.items.get(0);
                else
                    return null;
            }
        },
	last: function(clause) {
            if (clause != null) {
                return this.where(clause).last();
            }
            else {
                if (this.items.size() > 0)
                    return this.items.get(this.items.size() - 1);
                else
                    return null;
            }
        },
	elementAt: function(index) {
            return this.items.get(index);
        },
	concat: function(array) {
            var arr = array.items || array;
	    var x = aList();
            java.util.Collections.copyArray(this.items,x);
	    x.addAll(arr);
            return new $(x,this.actions.concat(["concat"]));
        },
	
	intersect: function(secondArray, clauseMethod) {
            
            clauseMethod = clauseMethod || function(item, item2, index, index2) {
		return (item["equals"] && item.equals(item2)) || (item2["equals"] && item2.equals(item1)) || item == item2;
	    };
            
            var sa = secondArray.items || secondArray;

            var result = aList()
            
    	    map(this.items,function(item,index){
	        
		map(sa,function(item2,index2){
		    if (clauseMethod(item, item2, index, index2)) {
                        result.add(item);
                    }
		})
	    });
	    
        return new $(result,this.actions.concat(["intersect"]));
        },
	defaultIfEmpty: function(defaultValue) {
	    if (this.items.size() == 0) {
                return defaultValue;
            }
            return this;
        },
        elementAtOrDefault: function(index, defaultValue) {
            if (index >= 0 && index < this.items.size()) {
                return this.items.get(index);
            }
            return defaultValue;
        },
        firstOrDefault: function(defaultValue) {
            return this.first() || defaultValue;
        },
        lastOrDefault: function(defaultValue) {
            return this.last() || defaultValue;
        },

	table: function(he,opts){
	    opts = opts || {};
	    if (he && !(typeof(he) === 'object' && he.constructor == Array)){
	        he = [he];
        }
	    headers = he || ["toString"];

	    var table = map(this.items,function(o,i) {
		var val = headers.map(function(h){
		    if (h.label){
			return getValue(o, h.slot || h.func, i);
		    }else{
			return getValue(o, h, i);
		    }
		});
		if (opts.index){
		    return [i].concat(val);
		}else{
		    return val;
		}
	    });
	    headers = headers.map(function(h){
		if ((typeof h) == "string"){
		    return h;
		}else{
		    return h.label;
		}
	    });
	    if (opts.index){
		headers = ["#"].concat(headers);
	    }
	    if (!opts.noHeader && he){
		tes.utils.printTable(table,headers);
	    }else{
		tes.utils.printTable(table);
	    }
	},
	limit: function (lower,upper){
	    if(!upper){
		upper = lower;
		lower = 0;
	    }
	    if (lower < 0){
		lower = 0;
	    }
	    if (upper > this.items.size()){
		upper = this.items.size();
	    }
	    var val = aList();
	    var hack = this;
	    range(lower,upper).map(function (index){
		val.add(hack.items.get(index));
	    });
	    return new $(val,this.actions.concat(["limit"]));
	},
	types: function (){
	    var rep = new java.util.HashSet();

	    map(this.items, function(obj){
		if(obj["getClass"]){
		    rep.add(obj.getClass().getName());
		}else{
		    rep.add(typeof obj);
		}
	    });
	    var l = new java.util.ArrayList(rep);
	    return new $(l,this.actions.concat(["types"]));
	},
    inspect: function (thing){
        tes.inspObj(this.items.get(thing));
    },
    entity: function (thing){
        tes.inspEnt(this.items.get(thing).getClass());
    }
    };
    $.fn.init.prototype = $.fn;
})();
