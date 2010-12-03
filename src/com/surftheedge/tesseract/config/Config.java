package com.surftheedge.tesseract.config;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.Undefined;
import org.mozilla.javascript.UniqueTag;

import com.surftheedge.tesseract.jsbridge.Slurp;

public class Config {
    private static Scriptable evaluateConfig(String source) {
	Context cx = Context.enter();
	Scriptable scope = cx.initStandardObjects();
	return (Scriptable) cx.evaluateString(scope, "var x = " + source + "; x", "<config>", 0, null);
    }
    
    public static Scriptable newConfig(String configFile) {
	return evaluateConfig(Slurp.slurp(configFile));
    }
    
    public static Object get(String property, Context cx, Scriptable scope){
	Scriptable config = getConfig(cx, scope);
	return get(property, config);
    }

    public static Object get(String property, Scriptable config) {
	Object result = config.get(property,config);
	if (UniqueTag.NOT_FOUND != result){
	    return result;
	}else{
	    return null;
	}
    }
    
    public static boolean JSbool(Object obj){
	if (obj == null || obj.equals(new Boolean(false)) || "undefined".equals(obj)){
	    return false;
	}else{
	    return true;
	}
    }

    private static Scriptable getConfig(Context cx, Scriptable scope){
	return ((Scriptable) cx.evaluateString(scope, "tesseract.config", "<getConfig>", 0, null));
    }
    
}
