package com.surftheedge.tesseract.utils;

import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.Scriptable;

import pt.ist.fenixframework.FenixFramework;

import com.surftheedge.tesseract.config.Config;

public class Loader {
    private static boolean loaded = false;

    public static void load(final Scriptable configuration) {
	if (!loaded) {
	    final Class r00tClass;
	    final Class modelClass;
	    pt.ist.fenixframework.Config config = null;

	    String rootClassName = (String) Config.get("rootClass",configuration);
	    try {
		r00tClass = Class.forName(rootClassName);
		if (Config.get("domainModelClass",configuration) != null) {
		    modelClass = Class.forName((String) Config.get("domainModelClass",configuration));
		} else {
		    modelClass = null;
		}
		config = new pt.ist.fenixframework.Config() {
		    {

			NativeArray na = (NativeArray) Config.get("domainModelPaths",configuration);
			int length = (int) na.getLength();
			String[] array = new String[length];
			for (int i = 0; i < length; i++) {
			    array[i] = (String) na.get(i, na);
			}
			/*
			 * if (modelClass != null) { domainModelClass =
			 * modelClass; }
			 */
			domainModelPaths = array;
			dbAlias = (String) Config.get("dbAlias",configuration);
			dbUsername = (String) Config.get("dbUsername",configuration);
			dbPassword = (String) Config.get("dbPassword",configuration);
			rootClass = r00tClass;
			updateRepositoryStructureIfNeeded = (Boolean) Config.get("updateRepositoryStructureIfNeeded",configuration);
		    }
		};
	    } catch (ClassNotFoundException e) {
		System.out.println("Class " + Config.get("rootClass",configuration) + " wasn't in classPath.");
		System.out.println("Make sure that every class required is in the classpath.");
		System.exit(-1);
	    }
	    try {
		FenixFramework.initialize(config);
	    } catch (Error e) {
		System.out.println("Initialization failed. Probably you don't have the Persistency Backend running. ");
		System.exit(-1);
	    }
	    loaded = true;
	}
    }
}
