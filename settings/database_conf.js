/**
 * Created by luneice on 17-11-16.
 */

dbdemo = {
	host: "localhost",
	port: "3306",
	user: "root",
	password: "luneice",
	database: "test"
};

orcale = {
	hostname: "localhost",
	port: 49161,
	database: "xe", // System ID (SID)
	user: "system",
	password: "oracle"
};

module.exports = {
	dbdemo: dbdemo,
	oracle: dbdemo
};