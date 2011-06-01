enyo.kind({
	name: "DP.DBHelper",
	
	nullHandleCount: 0,
	db: null,
	appVersion: null,
	
	DATABASE_NAME: "SatellitePlayer",
	
	DATABASE_SESSION_TABLE: "session",
	DATABASE_ARTIST_TABLE: "artist",
	DATABASE_GENRE_TABLE: "genre",
	DATABASE_ALBUM_TABLE: "album",
	DATABASE_TITLE_TABLE: "title",
	DATABASE_VERSION_TABLE: "version",
	DATABASE_PREFERENCES_TABLE: "preferences",

	/* TABLE FIELDS */
	KEY_SESSION_ACCESS_TOKEN: "access_token",
	KEY_SESSION_REFRESH_TOKEN: "refresh_token",
	KEY_SESSION_HELPER_STATUS: "helper_status",
	KEY_SESSION_NICKNAME: "nickname",
	KEY_SESSION_SCAN_STATE: "scan_state",
	KEY_SESSION_HELPER_VERSION: "helper_version",
	KEY_SESSION_ETAG: "etag",

	KEY_VERSION_DB: "db_version",
	KEY_VERSION_APP: "app_version",

	/* CREATE SCRIPTS*/
	DATABASE_CREATE_SESSION_TABLE: null,
	DATABASE_CREATE_VERSION_TABLE: null,
	DATABASE_CREATE_PREFERENCES_TABLE: null,
		
	DATABASE_VERSION_WEBOS: 3,
	DATABASE_VERSION: 1,

	callBackMethodInit: null,
	
	constructor: function (appVersion) {
		this.appVersion = appVersion;
	},
	
	/*	Fonction qui initialise la base de données, et va ensuite appeler la méthode
		qui créera les tables */
	initDataBase: function (onSuccess) {
		try {
			//Data base will have 1M
			this.db = openDatabase(this.DATABASE_NAME, this.DATABASE_VERSION_WEBOS, 'SatellitePlayer Data Store', 1024000);		
			this.callBackMethodInit = onSuccess;
			
			this.createTables();
		} catch (e)	{
			console.log('DBHelper.initDataBase : Error during initDataBase : '+e.message);
		}
	},
	
	/*	Fonction qui va d'abord créer la table version si elle n'existe pas, et ensuite
		appeler la fonction qui créera les tables en fonction de la version de base de données */
	createTables: function () {
		try {
			this.DATABASE_CREATE_SESSION_TABLE = " CREATE TABLE IF NOT EXISTS " + this.DATABASE_SESSION_TABLE
			+ " (" + this.KEY_SESSION_ACCESS_TOKEN + " text "
			+ ", " + this.KEY_SESSION_REFRESH_TOKEN + " text " 
			+ ", " + this.KEY_SESSION_HELPER_STATUS + " text " 
			+ ", " + this.KEY_SESSION_NICKNAME + " text " 
			+ ", " + this.KEY_SESSION_SCAN_STATE + " text " 
			+ ", " + this.KEY_SESSION_HELPER_VERSION + " text " 
			+ ", " + this.KEY_SESSION_ETAG + " text " 
			+ ");";
			
			this.DATABASE_CREATE_VERSION_TABLE = " CREATE TABLE IF NOT EXISTS " + this.DATABASE_VERSION_TABLE
			+ " (" + this.KEY_VERSION_DB + " integer primary key"
			+ ", " + this.KEY_VERSION_APP + " text " 
			+ ");";
			
			this.actionTableDataBase(this.DATABASE_CREATE_VERSION_TABLE, this.DATABASE_VERSION_TABLE);	// Création de la table version si besoin
			this.extractVersionDataBase(this.callBackVersions.bind(this));	// Récupération de la version de la base/appli pour savoir quelles tables créer
				
		} catch (e)
		{
			console.log('DBHelper.createTables : Error during createTables : '+e.message);
		}
	},
	
	/*	Fonction qui effectue une action (CREATE, ALTER ou DROP) sur une table */
	actionTableDataBase: function (scriptAction, tableName) {
		try {
			this.nullHandleCount = 0;
			this.db.transaction( 
				enyo.bind(this, (function (transaction) { 
					transaction.executeSql(scriptAction, [], 
						function(transaction, result){
							console.log('DBHelper.actionTableDataBase : Action OK on table ' + tableName);
							return true;
						}, 
						function(transaction, error){
							console.log('DBHelper.actionTableDataBase : Error was '+error.message+' (Code '+error.code+')'+' | script : '+scriptAction+' | '+ JSON.stringify(error)); 
							return true;
						});
				}))
			);
		}
		catch (e) {
			console.log('DBHelper.actionTableDataBase : Error during action on table ' + tableName + ' : '+e.message);
		}
	},
	
	/*	Fonction qui permet de récupérer la version de la base de données/application */
	extractVersionDataBase: function (onSuccess) {
		// Version 1 : Nothing to do
		var version = null;
		onSuccess(version);
	},
	
	/*	Fonction appelée une fois qu'on a récupéré la version de BD/APP
		Elle va ensuite créer les tables avec les structures adéquates */
	callBackVersions: function (version) {
		try {
			this.insertVersion(version);
			this.actionTableDataBase(this.DATABASE_CREATE_SESSION_TABLE, this.DATABASE_SESSION_TABLE);	// Création de la table version si besoin
		} catch(e) {
			console.log('DBHelper.callBackVersions : Error during the structure creation : ' + e.message);
		}
	},

	insertVersion: function (appVersion) {
		this.nullHandleCount = 0;
		var dbVersion = parseInt(this.DATABASE_VERSION);
		var appVersionInsert = this.appVersion;
		if (appVersion != null){
			appVersionInsert = appVersion;
		}
		
		var insertRequest = " INSERT INTO " + this.DATABASE_VERSION_TABLE
			+ " (" + this.KEY_VERSION_DB 
			+ ", " + this.KEY_VERSION_APP  
			+ ") VALUES(?,?);"; 
			
		this.clearVersion();
		this.db.transaction( 
			enyo.bind(this, (function (transaction) { 
					transaction.executeSql(insertRequest
							, [dbVersion, appVersionInsert]
							, function(transaction, result){
								console.log('DBHelper.insertVersion : version created');
								return true;
							}
							, function(transaction, error) { 
								console.log('DBHelper.insertVersion : Error was ' + error.message+' (Code '+error.code+')'); 
								return true;
							}); 
			}))
		); 
	},
	
	clearVersion: function () {
		this.nullHandleCount = 0;
		var deleteRequest = 'DELETE FROM ' + this.DATABASE_VERSION_TABLE +';';	
		
		this.db.transaction( 
			enyo.bind(this, (function (transaction) { 
					transaction.executeSql(deleteRequest
							, []
							,function(transaction, results) {
								console.log('DBHelper.clearVersion : version was removed.');
								return true;
							}
							,function(transaction, error) {
								console.log('DBHelper.clearVersion : Error was ' + error.message+' (Code '+error.code+')'); 
								return true;
							}
						); 
				}))
		);
	},

	saveSession: function (session) {
		var sessionQuery = 'SELECT COUNT(*) as CPT FROM ' + this.DATABASE_SESSION_TABLE + ';'
				
	    this.db.transaction( 
	        enyo.bind(this,(function (transaction) { 
	            transaction.executeSql(sessionQuery, [], 
					enyo.bind(this, function(transaction, results){
						if (results.rows.length > 0) {
							var row = results.rows.item(0);
							if(parseInt(row['CPT']) > 0) {
								var updateQuery = 'UPDATE ' + this.DATABASE_SESSION_TABLE + ' SET ' +
									this.KEY_SESSION_ACCESS_TOKEN + ' = "' + session.access_token + '", ' +
									this.KEY_SESSION_REFRESH_TOKEN + ' = "' + session.refresh_token + '", ' +
									this.KEY_SESSION_HELPER_STATUS + ' = "' + session.helper_status + '", ' +
									this.KEY_SESSION_NICKNAME + ' = "' + session.nickname + '", ' +
									this.KEY_SESSION_SCAN_STATE + ' = "' + session.scan_state + '", ' +
									this.KEY_SESSION_HELPER_VERSION + ' = "' + session.helper_version + '", ' +
									this.KEY_SESSION_ETAG + ' = "' + session.etag + '"; ';
								
								this.db.transaction( 
									enyo.bind(this,(function (transaction) { 
										transaction.executeSql(updateQuery, [], function(transaction, result) {}, function(transaction, error){ console.log('DBHelper.saveSession.insertSession : Error was '+error.message+' (Code '+error.code+')');  }); 
									})) 
								);
								
							} else {
								var insertQuery = 'INSERT INTO ' + this.DATABASE_SESSION_TABLE + ' ('+this.KEY_SESSION_ACCESS_TOKEN+','+this.KEY_SESSION_REFRESH_TOKEN+') VALUES ("'+session.access_token+'","'+session.refresh_token+'");';
								this.db.transaction( 
									enyo.bind(this,(function (transaction) { 
										transaction.executeSql(insertQuery, [], function(transaction, result) {}, function(transaction, error){ console.log('DBHelper.saveSession.insertSession : Error was '+error.message+' (Code '+error.code+')');  }); 
									})) 
								);
							}
						}
					}), 
					function(transaction, error){
						console.log('DBHelper.saveSession : Error was '+error.message+' (Code '+error.code+')'); 
						return true;
					});
	        }))
	    );
	}
});

var DBhelper = new DP.DBHelper(enyo.fetchAppInfo().version);
