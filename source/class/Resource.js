enyo.kind({
	name: "DP.Resource",
	type: null,
	
	resources: null,
		
	constructor: function (type) {
		this.type = type;
	},
	
	getResource: function(jsonObject) {
		this.resources = jsonObject.resources;
	},
});