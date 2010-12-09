package com.surftheedge.tesseract;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.io.Reader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import jline.ConsoleReader;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.EvaluatorException;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.NativeJavaObject;
import org.mozilla.javascript.Scriptable;

import pt.ist.fenixframework.pstm.Transaction;

import com.surftheedge.tesseract.config.Config;
import com.surftheedge.tesseract.jsbridge.EvaluationTransaction;
import com.surftheedge.tesseract.jsbridge.TopLevelContext;
import com.surftheedge.tesseract.utils.Loader;

public class JSConsole {
    private List<String> importDirectory;
    private Context cx;
    private final String prompts = "tes";
    private Scriptable scope;
    private PrintStream ps = new PrintStream(System.out);
    private HashMap<String, File> loadedFiles = new HashMap<String, File>();
    public ConsoleReader reader;
    private Scriptable config;
    private ArrayList<String> toExecute = new ArrayList<String>();

    public JSConsole(List<String> importDirectory, String configFile, String[] args) throws IOException {
	this.importDirectory = importDirectory;
	cx = Context.enter();
	scope = new TopLevelContext(cx, this);
	config = Config.newConfig(configFile);
	Scriptable env = cx.newObject(scope);
	env.put("config", env, config);
	env.put("engine", env, cx.getWrapFactory().wrapNewObject(cx, env, this));
	scope.put("tesseract", scope, env);
	Loader.load(config);
	processArguments(args);
	if (System.console() != null) {
	    reader = new ConsoleReader();
	    reader.addCompletor(new SemanticIntrospection(cx, scope));
	}
	cx.evaluateString(scope, "importClass(Packages." + Config.get("rootClass", config) + ");", "<boot>", 0, null);
    }

    private void processArguments(String[] args) {
	for (String string : args) {
	    if (string.startsWith("-d")) {
		String property = string.substring(2);
		String key = property.substring(0, property.indexOf(":"));
		String value = property.substring(property.indexOf(":") + 1);
		Config.set(key, value, cx, scope);
	    } else if (string.startsWith("-e")) {
		toExecute.add(string.substring(2));
	    }
	}
    }

    public static JSConsole getEngine(Context cx, Scriptable scope) {
	return (JSConsole) ((NativeJavaObject) cx.evaluateString(scope, "tesseract.engine", "<getEngine>", 0, null)).unwrap();
    }

    public String reader(BufferedReader in) {
	String source = "";
	boolean wrote = false;
	while (true) {
	    String newline;
	    try {
		if (System.console() != null) {
		    String prompt;
		    if (!Config.JSbool(Config.get("prompt", config)) && Config.get("prompt", config) instanceof Function) {
			if (Config.JSbool(Config.get("canWrite", config))
				&& !Config.JSbool(Config.get("notWarnWhenCanWrite", config))) {
			    prompt = "\u001b[1;41m" + prompts + " *Write Mode ON*>\u001b[m";
			} else {
			    prompt = prompts + ">";
			}
		    }else{
			Function fn = (Function) Config.get("prompt", config);
			prompt = Context.toString(fn.call(cx, scope, fn, new Object[]{}));
		    }
		    newline = reader.readLine(wrote ? "" : prompt);
		    wrote = true;
		} else {
		    newline = in.readLine();
		}
	    } catch (IOException ioe) {
		ps.println(ioe.toString());
		break;
	    }
	    if (newline == null) {
		return null;
	    }
	    source = source + newline + "\n";
	    if (cx.stringIsCompilableUnit(source))
		return source;
	}
	return null;
    }

    private String slurp(Reader in) throws IOException {
	StringBuffer out = new StringBuffer();
	char[] b = new char[4096];
	for (int n; (n = in.read(b)) != -1;) {
	    out.append(new String(b, 0, n));
	}
	return out.toString();
    }

    public void loopFile(BufferedReader in, String file) {
	try {
	    while (true) {
		String source = slurp(in);
		try {
		    cx.evaluateString(scope, source, file, 1, null);
		    return;
		} catch (EvaluatorException e) {
		    System.out.println("Error while loading runtime: " + e.getMessage());
		    System.exit(-1);
		}
	    }
	} catch (IOException e1) {
	    e1.printStackTrace();
	}
    }

    public void loopSource(BufferedReader in) {
	while (true) {
	    String source = reader(in);
	    if (source == null) {
		break;
	    }

	    Transaction.withTransaction(!Config.JSbool(Config.get("canWrite", cx, scope)), new EvaluationTransaction(cx, scope,
		    source));
	}
	if (System.console() != null) {
	    ps.println();
	}
    }

    public void loadDirectory(File f) {
	String[] children = f.list();
	if (children == null) {
	} else {
	    for (int i = 0; i < children.length; i++) {
		File child = new File(f.getPath() + "/" + children[i]);
		if (child.isDirectory()) {
		    loadDirectory(child);
		} else if (child.isFile() && !child.isHidden()) {
		    if (children[i].endsWith(".js") && !loadedFiles.containsKey(f.getPath() + "/" + children[i])) {
			loadedFiles.put(f.getPath() + "/" + children[i], child);
		    }
		}
	    }
	}
    }

    public void loadResources() {
	for (String r : importDirectory) {
	    loadDirectory(new File(r));
	}
	for (java.util.Map.Entry<String, File> f : loadedFiles.entrySet()) {
	    File file = f.getValue();
	    try {
		FileReader fir = new FileReader(file);
		BufferedReader br = new BufferedReader(fir);
		if (Config.JSbool(Config.get("verbose", cx, scope))) {
		    System.out.println("Load RT file: " + f.getKey());
		}
		loopFile(br, f.getKey());
	    } catch (FileNotFoundException e) {
		System.out.println("file not found: " + f.getKey());
	    }
	}
    }

    public void exec() {
	loadResources();
	if (toExecute.size() > 0) {
	    for (String string : toExecute) {
		Transaction.withTransaction(!Config.JSbool(Config.get("canWrite", cx, scope)), new EvaluationTransaction(cx,
			scope, string));
	    }
	} else {
	    System.out.println("");
	    BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
	    loopSource(in);
	}
    }

}
