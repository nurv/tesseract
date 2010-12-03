package com.surftheedge.tesseract.jsbridge;

import java.io.BufferedInputStream;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

public class Slurp {
    @SuppressWarnings("deprecation")
    public static String slurp(String path) {
	File file = new File(path);
	FileInputStream fis = null;
	BufferedInputStream bis = null;
	DataInputStream dis = null;
	String s = "";

	try {
	    fis = new FileInputStream(file);

	    // Here BufferedInputStream is added for fast reading.
	    bis = new BufferedInputStream(fis);
	    dis = new DataInputStream(bis);

	    // dis.available() returns 0 if the file does not have more lines.
	    while (dis.available() != 0) {

		// this statement reads the line from the file and print it to
		// the console.
		s += dis.readLine() + "\n";
	    }

	    // dispose all the resources after using them.
	    fis.close();
	    bis.close();
	    dis.close();

	} catch (FileNotFoundException e) {
	    e.printStackTrace();
	} catch (IOException e) {
	    e.printStackTrace();
	}
	return s;
    }
}
