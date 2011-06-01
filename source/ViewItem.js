/* Copyright 2009-2011 Hewlett-Packard Development Company, L.P. All rights reserved. */
enyo.kind({
	name: "ViewItem",
	kind: enyo.Item,
	tapHighlight: true,
	published: {
		title: "",
		description: "",
		type: ""
	},
	components: [
		{name: "title"},
		{name: "description", className: "enyo-item-secondary"}
	],
	create: function(inProps) {
		this.inherited(arguments);
		this.titleChanged();
		this.descriptionChanged();
	},
	titleChanged: function() {
		this.$.title.setContent(this.title);
	},
	descriptionChanged: function() {
		this.$.description.setContent(this.description);
	},
	// default click handling
	clickHandler: function() {
		this.owner.owner.getResources(this.type);
	}
});
