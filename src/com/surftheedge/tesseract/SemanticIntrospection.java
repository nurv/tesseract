package com.surftheedge.tesseract;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import jline.Completor;
import jvstm.TransactionalCommand;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.Scriptable;

import pt.ist.fenixframework.pstm.Transaction;

import com.surftheedge.tesseract.config.Config;

public class SemanticIntrospection implements Completor {
    ArrayList<String> classNames;
    ArrayList<String> domainClasses;
    Context cx;
    Scriptable scope;

    public SemanticIntrospection(Context cx, Scriptable scope) throws IOException {
	this.cx = cx;
	this.scope = scope;
    }

    @SuppressWarnings("unchecked")
    public int complete(final String buffer, final int cursor, final List candidates) {
	try{
	if (Config.JSbool(Config.get("autoComplete", cx, scope))) {
	    Scriptable scriptable = (Scriptable) Config.get("autoCompleteFunction", cx, scope);
	    if (scriptable instanceof Function) {
		final Function fn = (Function) scriptable;
		Transaction.withTransaction(true, new TransactionalCommand() {
		    public void doIt() {
			Object na = fn.call(cx, fn, scope, new Object[] { buffer, cursor });
			if (na instanceof NativeArray) {
			    for (int i = 0; i < ((NativeArray) na).getLength(); i++) {
				String string = Context.toString(((NativeArray) na).get(i, (Scriptable) na));
				candidates.add(string);
			    }
			}
			
		    }
		});
	    }
	}
	}catch(Throwable t){
	}
	return 0;
    }

}
