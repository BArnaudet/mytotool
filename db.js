var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'mytotool'
});
connection.connect(function(error){
	if(!!error) {
		console.log('Erreur de connexion à la Base de données');
	} else {
		console.log('Connecté à la Base de données');
	}
});

module.exports = connection;