/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2010 by Artur Ventura
 *
 * File: foo.js
 * Time-stamp: Wed Jan 20 14:02:42 2010
 *
 * Author: Artur Ventura
 */

/*importClass(Packages.eu.ist.fears.server.domain.FearsApp);
 var x = map( FearsApp.getFears().getAdmins(),
 function(u1) {
 return u1.getName();
 }).
 filter(function(x){
 return x != "ist23648"
 }).
 reduce(function(u1, u2) { 
 return u1 + " & " + u2; 
 })
 print ("os Administradores sÃ£o " + x);*/

importClass(Packages.eu.ist.fears.server.domain.FearsApp);
// print ("\n--- A testar inspec‹o de instancias ---------------------->\n")
tes.inspObj(FearsApp.getFears().getAdmins().get(0));
tes.inspRel(FearsApp.getFears().getAdmins().get(0), "voter");
tes.inspRel(FearsApp.getFears().getAdmins().get(0), "voter", [ {
	name : "user",
	func : function(o) {
		return o.getUser().getUsername();
	}},{
	name : "user2",
	func : function(o) {
		return o.getUser().getUsername();
	}
}],["votesUsed"]);
// print ("\n--- A testar inspec‹o de entidades ----------------------->\n")
tes.inspEnt(FearsApp.getFears().getAdmins().get(0).getClass());
