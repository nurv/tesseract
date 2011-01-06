/* -*- Mode: Javascript -*-
 * -*- coding: UTF-8 -*-
 * Copyright (C) 2010 by Artur Ventura
 *
 * File: fenixFix.js
 * Time-stamp: Sat Dec 09 10:10:00 2010
 *
 * Author: Artur Ventura
 */

if (Packages.net.sourceforge.fenixedu.domain.RootDomainObject) {
    Packages.net.sourceforge.fenixedu.domain.RootDomainObject.init();
    Packages.net.sourceforge.fenixedu.applicationTier.FenixService.init(Packages.net.sourceforge.fenixedu.domain.RootDomainObject.getInstance());
    Packages.net.sourceforge.fenixedu.applicationTier.Servico.content.CreateMetaDomainObectTypes.run();
}/*else if (Packages.eu.ist.fears.server.domain.FearsApp) {
}*/
