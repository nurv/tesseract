package com.surftheedge.tesseract.jsbridge;

import jvstm.TransactionalCommand;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.NativeJavaObject;
import org.mozilla.javascript.RhinoException;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.tools.ToolErrorReporter;

import pt.ist.fenixframework.pstm.IllegalWriteException;
import pt.ist.fenixframework.pstm.RelationList;

public class EvaluationTransaction implements TransactionalCommand {
    String source;
    Context cx;
    Scriptable scope;
    private Object result;

    public EvaluationTransaction(Context cx, Scriptable scope, String source) {
	this.source = source;
	this.cx = cx;
	this.scope = scope;
    }

    public void doIt() {
	cx.setErrorReporter(new ToolErrorReporter(false, System.out));
	try {
	    Object result = cx.evaluateString(scope, source, "<cmd>", 1, null);

	    // Avoid printing out undefined or function definitions.
	    if (result != Context.getUndefinedValue() && !(result instanceof Function && source.trim().startsWith("function"))) {
		try {
		    if (result instanceof NativeJavaObject && ((NativeJavaObject) result).unwrap() instanceof RelationList) {
			System.out.println("#<RelationList: size " + ((RelationList) ((NativeJavaObject) result).unwrap()).size()
				+ ">");
		    } else {
			System.out.println(Context.toString(result));
		    }
		} catch (RhinoException rex) {
		    ToolErrorReporter.reportException(cx.getErrorReporter(), rex);
		}
	    }
	} catch (IllegalWriteException e) {
	    System.out.println("Got an IllegalWriteException. Please turn on write mode.");
	} catch (RhinoException e) {
	    ToolErrorReporter.reportException(cx.getErrorReporter(), e);
	}
	// NativeArray h = global.history;
	// h.put((int) h.getLength(), h, source);
    }

    public void setResult(Object result) {
	this.result = result;
    }

    public Object getResult() {
	return result;
    }

}
