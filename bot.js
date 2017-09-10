const Discord = require('discord.js');
const https = require('https');
const fs = require('fs');
const client = new Discord.Client();
const TOA_web = 'https://www.theorangealliance.org/api'
var defaultsPackage = []
const prefix = '!!'

fs.readFile('defaults.txt', 'utf8', function(err,data) {
	
	if(err)console.log(err);
	else{
		defaultsPackage = data.split('\n')[0].split(' ');
		
		
		client.on('ready', () => {
			console.log('Logged in as ' + client.user.tag + '.');
		});

		client.on('message', msg => {
			if(!msg.author.bot){
				if(msg.content.toLowerCase().includes(prefix)){
					var cmd = msg.content.substring(prefix.length,msg.content.length).toLowerCase();
					if(cmd == "version"){
							msg.reply(getTOA_Stats('').toString());
					}else if (cmd == "test"){
						var date = new Date();
						msg.reply("Today's date: " + date.getDate() + "/"+ (date.getMonth()+1) + "/" + date.getFullYear() + ". The hour is " + date.getHours());	
					}else if (cmd == "help"){
						msg.reply("Real men don't need help. " + client.emojis.find("name", "HyperLul").toString());
					}else{
						msg.reply("That is not a valid command! Use !!help for a list of valid commmands.");
					}
				}
			
				if(msg.content.toLowerCase() == 'ping')msg.reply('pong');
			}
		});
		client.login(defaultsPackage[0]);
	}
});

function getTOA_Stats(apiSubRoutine){
	var options = {	
		host: TOA_web,
		headers: { 'X-Application-Origin': 'Smida Syndicate', 'X-TOA-Key': defaultsPackage[1] }
	}
	const req = https.get(options
	, (res) => {
		res.on('data', (data) => {
			console.log(data.toString());
			return data;
		});
	});
	req.on('error', (e)=>{
		return 'error';
	});
	req.end();
	
	return 'no response';
}