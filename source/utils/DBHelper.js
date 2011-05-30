var DBHelper = function (appVersion) {
	console.log('DBHelper.DBHelper() : Initialisation of DBHelper');
	
	this.nullHandleCount = 0;
	this.db = null;
	this.appVersion = appVersion;
	
	this.DATABASE_NAME = "SatellitePlayer";
	this.DATABASE_PROFILE_TABLE = "profile";
	
	this.DATABASE_VERSION_WEBOS = 3;
	this.DATABASE_VERSION = 1;
}

/* Init the database and create the table if don't exists*/
DBHelper.prototype.initDataBase = function (onSucess) {
	try {
		//Data base will have 1M
		if (this.cst.LOG_DEBUG){
			console.log('DBHelper.initDataBase : Initialisation of data base');
		}
		
		this.db = openDatabase(this.DATABASE_NAME, this.DATABASE_VERSION_WEBOS, 'SatellitePlayer Data Store', 1024000);		
		this.callBackMethodInit = onSucess;
	}
	catch (e)
	{
		console.log('DBHelper.initDataBase : Error during initDataBase : '+e.message);
	}
};