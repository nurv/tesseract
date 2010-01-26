/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2010 by Artur Ventura
 *
 * File: y.js
 * Time-stamp: Fri Jan 22 20:46:23 2010
 *
 * Author: Artur Ventura
 */
importClass(Packages.eu.ist.fears.server.domain.FearsApp);

var z = ($(FearsApp.getFears().getAdmins()).where(
    function(user){
	return find(user.getVoter(),
		    function(voter){
			return voter.getVotesUsed() > 0;
		    });
    }).limit(3));
z.table(["username"]);
$(z).where(function(x){ return x.getUsername().equals("ist12048"); });

importClass(Packages.eu.ist.fears.server.domain.FearsApp);
$(FearsApp.getFears().getAdmins()).selectAll("getVoter").count();
var t = $(FearsApp.getFears().getAdmins()).selectAll("getVoter").select("project");
t.count();
t.distinct().count();
t.distinct().table();

$(range(-2,2).toArray()).distinct(function (x) {return Math.abs(x);}).table();
