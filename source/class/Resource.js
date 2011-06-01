enyo.kind({
	name: "DP.Resource",
	type: null,
	
	resources: null,
	
	playlists: null,
	artists: null,
	albums: null,
	genres: null,
		
	constructor: function (type) {
		this.type = type;
	},
	
	getResource: function(jsonObject) {
		this.resources = jsonObject.resources;
		
		switch(this.resources.type) {
			case "playlists":
				this.playlists = this.resources;
				break;
			case "albums":
				this.albums = this.resources;
				break;
			case "artists":
				this.artists = this.resources;
				break;
			case "genres":
				this.genres = this.resources;
				break;
		}
	},
});