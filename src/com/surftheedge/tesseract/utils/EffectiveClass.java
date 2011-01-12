package com.surftheedge.tesseract.utils;

import java.util.HashSet;
import java.util.Set;

import pt.ist.fenixframework.FenixFramework;
import dml.DomainClass;
import dml.Role;
import dml.Slot;

public class EffectiveClass {
    public static Set<Slot> getEffecitveSlots(String cl) {
	DomainClass aCl = FenixFramework.getDomainModel().findClass(cl);
	HashSet<Slot> slots = new HashSet<Slot>();
	while (aCl != null) {
	    slots.addAll(aCl.getSlotsList());
	    aCl = (DomainClass) aCl.getSuperclass();
	}
	return slots;
    }

    public static Set<Role> getEffecitveRelations(String cl) {
	DomainClass aCl = FenixFramework.getDomainModel().findClass(cl);
	HashSet<Role> relations = new HashSet<Role>();
	while (aCl != null) {
	    relations.addAll(aCl.getRoleSlotsList());
	    aCl = (DomainClass) aCl.getSuperclass();

	}
	return relations;
    }
}
