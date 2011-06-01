enyo.kind({
	name: "DP.Session",
	dbhelper: null,
	
	published: {
		access_token: null,
		expires_in: 0,
		refresh_token: null,
		helper_status: null,
		nickname: null,
		scan_state: null,
		helper_version: null,
		etag: null
	},
	
	constructor: function () {
		
	},
	
	getSession: function (jsonValues) {
		this.access_token 	= jsonValues.access_token;
		this.expires_in 	= jsonValues.expires_in;
		this.refresh_token 	= jsonValues.refresh_token;
	},
	
	getState: function(jsonValues) {
		this.helper_status 	= jsonValues.helper_status;
		this.nickname 		= jsonValues.nickname;
		this.scan_state 	= jsonValues.scan_state;
		this.helper_version = jsonValues.helper_version;
		this.etag 			= jsonValues.etag;
	},
	
	save: function () {
		enyo.bind(DBhelper, DBhelper.saveSession(this));
	}
});

var Session = new DP.Session();