package com.surftheedge.tesseract.jsbridge;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.ImporterTopLevel;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeJavaObject;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Undefined;

import pt.ist.fenixframework.pstm.Transaction;

import com.surftheedge.tesseract.JSConsole;
import com.surftheedge.tesseract.config.Config;

public class TopLevelContext extends ImporterTopLevel {

    private static final long serialVersionUID = 1L;
    public static String[] names = { "map", "reduce", "filter", "print", "printf", "typeOf", "find","run","reloadRuntime","slurp","objectKeys","scope"};
    public TopLevelContext() {
    }

    public TopLevelContext(Context cx,JSConsole engine) {
	super();
	init(cx);
    }

    public void init(Context cx) {
	initStandardObjects(cx, false);
	defineFunctionProperties(names, TopLevelContext.class, ScriptableObject.DONTENUM);
    }

    public static void run(Context cx, Scriptable thisObj, Object[] args, Function funObj) {
	String filename = (String) args[0];
	File file = new File(filename);
	FileReader fir;
	try {
	    fir = new FileReader(file);
	    BufferedReader br = new BufferedReader(fir);
	    JSConsole.getEngine(cx, thisObj).loopFile(br, filename);
	} catch (FileNotFoundException e) {
	    System.err.print("File '" + filename + "' was not found");
	}
    }
    
    public static Object slurp(Context cx, Scriptable thisObj, Object[] args, Function funObj){
	String filename = (String) args[0];
	return Slurp.slurp(filename);
    }
    
    public static void reloadRuntime(Context cx, Scriptable thisObj, Object[] args, Function funObj) {
	JSConsole.getEngine(cx, thisObj).loadResources();
    }

    public static Object map(Context cx, Scriptable thisObj, Object[] args, Function funObj) {
	NativeJavaObject njo = (NativeJavaObject) args[0];
	NativeArray array = (NativeArray) cx.newArray(thisObj, 0);
	Function f = (Function) args[1];
	Collection list = (Collection) njo.unwrap();
	int i = 0;
	for (Object o : list) {
	    Object[] argx = { o, Context.javaToJS(i, f), njo };
	    Object r = f.call(cx, thisObj, f, argx);
	    array.put((int) array.getLength(), array, Context.javaToJS(r, f));
	    i++;
	}
	return array;
    }

    public static void print(Context cx, Scriptable thisObj, Object[] args, Function funObj) {
	for (Object result : args) {
	    System.out.print(Context.toString(result));
	}
    }

    public static void printf(Context cx, Scriptable thisObj, Object[] args, Function funObj) {
	Object[] o = new Object[args.length - 1];
	System.arraycopy(args, 1, o, 0, args.length - 1);
	System.out.printf((String) args[0], o);
    }

    public static Object reduce(Context cx, Scriptable thisObj, Object[] args, Function funObj) {
	NativeJavaObject njo = (NativeJavaObject) args[0];
	Function f = (Function) args[1];
	Collection list = (Collection) njo.unwrap();
	int i = 0;
	Object or = null;
	for (Object o : list) {
	    if (i==1) { or = o; continue;}
	    Object[] argx = { or, o, i, njo };
	    or = f.call(cx, thisObj, f, argx);
	    i++;
	}
	return or;
    }

    public static Object filter(Context cx, Scriptable thisObj, Object[] args, Function funObj) {
	NativeArray array = (NativeArray) cx.newArray(thisObj, 0);
	NativeJavaObject njo = (NativeJavaObject) args[0];
	Function f = (Function) args[1];
	Collection list = (Collection) njo.unwrap();
	int i = 0;
	for (Object o : list) {
	    Object[] argx = { o, i, njo };
	    Object r = f.call(cx, thisObj, f, argx);
	    if (r != null && r.getClass() != Undefined.class && !r.equals(false)) {
		array.put((int) array.getLength(), array, o);
	    }
	}

	return array;
    }

    public static Object find(Context cx, Scriptable thisObj, Object[] args, Function funObj) {
	NativeJavaObject njo = (NativeJavaObject) args[0];
	Function f = (Function) args[1];
	Collection list = (Collection) njo.unwrap();
	int i = 0;
	for (Object o : list) {
	    Object[] argx = { o, i, njo };
	    Object r = f.call(cx, thisObj, f, argx);
	    if (r != null && r.getClass() != Undefined.class && !r.equals(false)) {
		return Context.javaToJS(o, f);
	    }
	}
	return null;
    }

    public static Object typeOf(Context cx, Scriptable thisObj, Object[] args, Function funObj) {
	if (args[0] instanceof NativeJavaObject){
	    NativeJavaObject obj = (NativeJavaObject) args[0];
	    return obj.unwrap().getClass().getName();
	}else{
	    return args[0].getClass().getName();
	}
    }
    
    public static Object objectKeys(Context cx, Scriptable scope, Object[] args, Function funObj) {
	Scriptable obj = (Scriptable) args[0];
	Set<String> collection = new HashSet<String>();
	for (Object k : obj.getIds()) {
	    String s = Context.toString(k);
	    collection.add(s);
	}
	if (obj.getPrototype() != null) {
	    for (Object k : obj.getPrototype().getIds()) {
		String s = Context.toString(k);
		collection.add(s);
	    }
	}
	
	return setToArray(cx, scope, collection);
    }
    
    public static Object scope(Context cx, Scriptable scope, Object[] args, Function funObj) {
	Set<String> collection = new HashSet<String>();
	for (Object k : scope.getIds()) {
	    String s = Context.toString(k);
	    collection.add(s);
	}
	if (scope.getParentScope() != null) {
	    for (Object k : scope.getParentScope().getIds()) {
		String s = Context.toString(k);
		collection.add(s);
	    }
	}
	for(String name : names){
	    collection.add(name);
	}
	
	return setToArray(cx, scope, collection);
    }

    private static NativeArray setToArray(Context cx, Scriptable scope, Set<String> collection) {
	int i=0;
	NativeArray na = (NativeArray) cx.newArray(scope, collection.size());
	for (String string : collection) {
	    na.put(i++, na, string);
	}
	return na;
    }

}
