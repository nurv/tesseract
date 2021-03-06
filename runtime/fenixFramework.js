/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2010 by Artur Ventura
 *
 * File: fenixFramework.js
 * Time-stamp: Wed Jan 20 14:02:42 2010
 *
 * Author: Artur Ventura
 */

tesseract.fenixFramework = {
	/* inspObj : inspects DomainModel entity instances acording with
	 *           their declaration in the cfg.dml file.
	 */
	inspObj : function(obj) {
		importClass(Packages.pt.ist.fenixframework.FenixFramework);

		var slots = FenixFramework.getDomainModel().findClass(
				obj.getClass().getName()).getSlotsList();

		print("Instance of: " + obj.getClass().getName() + "\n");
		var table1 = []

		map(slots,
				function(u) {
					var x = "" + u.getName();
					table1.push([ "" + u.getName(),
							obj[tesseract.utils.getter(x)]() ]);
				});
		tesseract.utils.printTable(table1, {}, [ "slot", "value" ]);

		var relations = FenixFramework.getDomainModel().findClass(
				obj.getClass().getName()).getRoleSlotsList();

		var table2 = [];
		map(relations, function(r) {
			var x = "" + r.getName();
			var xinobi;
			try {
				if (r.getMultiplicityUpper() == 1) {

					var k = obj[tesseract.utils.getter(x)]()
					if (k == null) {
						xinobi = "<null>"
					} else {
						xinobi = k.getClass().getName() + "(";
						if (k.getExternalId) {
							xinobi = xinobi + k.getExternalId();
						} else {
							xinobi = xinobi + k.getOid()
						}
						xinobi += ")";
					}

				} else {
					xinobi = "" + r.getType().getFullName() + "(<lenght: "
							+ obj[tesseract.utils.getter(x)]().size() + ">)";
				}
			} catch (e) {
				xinobi = "<exception thrown>";
			}
			table2.push([ x, xinobi ]);
		});
		tesseract.utils.printTable(table2, {}, [ "relation", "value/size" ]);
	},

	/* inspEnt : inspects a class from the DomainModel. it can recive
	 *           a .getClass() object or a cannonical name for a class
	 *           as string.
	 */
	inspEnt : function(clazz) {
		importClass(Packages.pt.ist.fenixframework.FenixFramework);
		var slots;
		var relations;
		if (typeof clazz === "string") {
			print("Entity " + clazz + "\n");
			slots = FenixFramework.getDomainModel().findClass(clazz)
					.getSlotsList();
			relations = FenixFramework.getDomainModel().findClass(clazz)
					.getRoleSlotsList();
		} else {
			print("Entity " + clazz.getName() + "\n");
			slots = FenixFramework.getDomainModel().findClass(clazz.getName())
					.getSlotsList();
			relations = FenixFramework.getDomainModel().findClass(
					clazz.getName()).getRoleSlotsList();
		}

		var table1 = []
		map(slots, function(u) {
			table1.push([ "" + u.getName(), "" + u.getTypeName() ]);
		});
		tesseract.utils.printTable(table1, {}, [ "slot", "type" ]);

		var table2 = [];

		map(relations, function(r) {
			var name = "" + r.getName();
			var type = "" + r.getType().getFullName();
			var mult;
			if (r.getMultiplicityUpper() == -1) {
				mult = "*";
			} else if (r.getMultiplicityLower() == 0
					&& r.getMultiplicityUpper() == 1) {
				mult = "1";
			} else {
				mult = r.getMultiplicityLower() + ".."
						+ r.getMultiplicityUpper();
			}
			table2.push([ name, type, mult ]);
		});
		tesseract.utils.printTable(table2, {}, [ "relation", "type",
				"multiplicity" ]);
	},

	/* inspRel : displays a table with the objects in this
	 *           relation. Receives an DomainModel Entity and a string with the
	 *           relation name. It will present a table containing the the declared
	 *           slots in the DomainModel. The third option is a map that can be
	 *           used for two options: `index` adds an extra column with the index
	 *           of each object and `noHeader`allows removing the header. The
	 *           fourth option can be used to witch columns to appear
	 */
	inspRel : function(object, rel, xtraStuff, sel) {
		importClass(Packages.pt.ist.fenixframework.FenixFramework);

		var relation = find(FenixFramework.getDomainModel().findClass(
				object.getClass().getName()).getRoleSlotsList(), function(r) {
			return r.getName() == rel;
		});
		var select = {}
		sel && sel.map(function(x) {
			select[x] = true
		});

		var slots = FenixFramework.getDomainModel().findClass(
				relation.getType().getFullName()).getSlotsList();
		var list = object[tesseract.utils.getter(rel)]()
		var header = [];
		if (!sel || (sel && select["ID"])) {
			header.push("ID");
		}
		var table = [];
		map(slots, function(slot) {
			if (!sel || (sel && select["" + slot.getName()])) {
				header.push("" + slot.getName());
			}
		});
		map(list, function(o) {
			var line = [];
			var queried;
			if (!sel || (sel && select["ID"])) {
				line
						.push(""
								+ ((o.getExternalId && o.getExternalId()) || o
										.getOid()));
				queried = header.slice(1);
			} else {
				queried = header;
			}

			queried.map(function(s) {
				line.push(o[tesseract.utils.getter(s)]());
			});
			xtraStuff && xtraStuff.map(function(req) {
				line.push("" + req.func(o).toString());
			});
			table.push(line);
		});
		xtraStuff && xtraStuff.map(function(o) {
			header.push(o.name)
		});
		print(object.getClass().getName() + "." + tesseract.utils.getter(rel)
				+ "():" + relation.getType().getFullName() + "\n");
		tesseract.utils.printTable(table, {}, header);
	}
};

tesseract.utils = {

	/* printTable : prints a table.
	 */
	printTable : function(table, highlight, headers) {
		print(tesseract.utils.generateTable(table,highlight,headers));
	},
	
	/* generateTable : generates a table.
	 */
	generateTable : function(table, highlight, headers) {
		// Find out what the maximum number of columns is in any row
		var theResult = "";
		function drawLine() {
			theResult += "+";
			lengths.map(function(size) {
				range(0, size + 2).map(function() {
					theResult +=  "-";
				});
				theResult += "+";
			});
			theResult += "\n";
		}

		var maxColumns = 0;
		var calcTab = [ headers ].concat(table);
		calcTab.map(function(line) {
			if (line) {
				maxColumns = Math.max(line.length, maxColumns);
			}
		})

		// Find the maximum length of a string in each column
		var lengths = [];
		calcTab.map(function(line) {
			line && line.map(function(cell, j) {
				lengths[j] = Math.max(("" + cell).length, lengths[j] || 0);
			});
		});

		// Generate a format string for each column
		var formats = [];
		lengths.map(function(size, i) {
			formats[i] = " " + "%1$" + size + "s ";
		});

		drawLine();
		
		if (headers) {
			theResult += "|";
			headers.map(function(cell, j) {
				theResult += (new java.util.Formatter()).format(formats[j], "" + cell).toString() + "|";
			});
			theResult += "\n";
			drawLine();
		}

		table.map(function(line, i) {
			theResult += "|";
			line.map(function(cell, j) {
				var fg = (highlight[i] && highlight[i][0] && tesseract.color.color(highlight[i][0])) || "";
				var bg = (highlight[i] && highlight[i][1] && tesseract.color.bg(highlight[i][1])) || "";
				theResult += (new java.util.Formatter()).format(bg + fg + formats[j] + tesseract.color.reset(), "" + cell ).toString() + "|";
			})
			theResult += "\n";
		})

		drawLine();
		return theResult;
	},

	/* getter : returns a getter .
	 */
	getter : function(thing) {
		return "get" + thing.charAt(0).toUpperCase() + thing.slice(1)
	}
}