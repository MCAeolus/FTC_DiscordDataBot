const Discord = require('discord.js');
const http = require('http');
const request = require('request');
const fs = require('fs');
const util = require('util');
const client = new Discord.Client();
const TOA_web = 'theorangealliance.org'
const prefix = '420'
var defaultsPackage = []

fs.readFile('defaults.txt', 'utf8', function(err,data) {
	
	if(err)console.log(err);
	else{
		defaultsPackage = data.split('\n')[0].split(' ');
		
		
		client.on('ready', () => {
			console.log('Logged in as ' + client.user.tag + '.');
			client.user.setGame('FTC - Team 4221');
		});

		client.on('message', msg => {
			if(!msg.author.bot){
				if(msg.content.substring(0,prefix.length) == prefix && !msg.content.substring(prefix.length,prefix.length+1).includes(prefix.substring(0,1))){
					var cmd = msg.content.substring(prefix.length,msg.content.length).split(' ');
					cmd[0] = cmd[0].toLowerCase();
					if(cmd[0] == "teamcount"){                                                    /* TEAM COUNT */
						getTOA_Stats('/teams/count', function(e, r, d) {
							j = JSON.parse(d);
							msg.reply("There are " + j[0].TeamsCount + " teams registered for FTC.");
						});
					}else if(cmd[0] == "teaminfo"){                                               /* TEAM INFO */
						if(cmd.length == 1)
							msg.reply("Please pass the team number argument (" + prefix + "teamcount <team_number>)");
						else{
							getTOA_Stats('/team/'+cmd[1], function(e, r, d) {
								j = JSON.parse(d);
								if(j[0] == null)msg.reply("Team " + cmd[1] + " is not a registered team!");
								else{
									msg.reply("Team info for " + cmd[1]);
									msg.channel.send("**Team Location** - " + j[0].city + ", " + j[0].region_key + ", " + j[0].country + "\n"
											       + ((j[0].team_name_short != null) ? "**Team Name (Short)** - " + j[0].team_name_short + "\n" : "")
											       + ((j[0].team_name_long != null) ? "**Team Name (Long)** - " + j[0].team_name_long + "\n" : "")
											       + ((j[0].robot_name != null) ? "**Robot Name** - " + j[0].robot_name + "\n" : "")
											       + "**Rookie Year** - " + j[0].rookie_year + "\n"
											       + ((j[0].website != null) ? "**Website** - " + j[0].website : "")
									);
								}
								
							});
						}
					}else if(cmd[0] == "teamevents"){                                              /* TEAM EVENTS */
						if(cmd.length == 1)
							msg.reply("Please pass the team number argument (" + prefix + "teamevents <team_number>)");
						else{
							getTOA_Stats('/registration/team/'+cmd[1], function(e, r, d) {
								j = JSON.parse(d);
								if(j[0] == null)msg.reply("Team " + cmd[1] + " is either not a team or has no events registered.");
								else{
									msg.reply("Event registration info for team " + cmd[1]);
									msg.channel.send(d);
								}
							});
						}
					}else if (cmd[0] == "date"){                                                   /* DATE */
						var date = new Date();
						msg.reply("Today's date: " + date.getDate() + "/"+ (date.getMonth()+1) + "/" + date.getFullYear() + ". The hour is " + date.getHours());	
					}else if (cmd[0] == "help"){                                                   /* HELP */
						mr = (Math.random() * 100) + 1;
						if(mr > 90)
							msg.reply("Real men don't need help. " + client.emojis.find("name", "HyperLul").toString());
						else
							msg.reply("**-- HELP --**\n"
									 + prefix + "teamcount - returns total teams registered for FTC.\n"
									 + prefix + "teaminfo <team_number> - returns the team info of a given FTC team.\n"
									 + prefix + "teamevents <team_number> - returns all events the given FTC team is registered for."
							);
					}else{
						msg.reply("That is not a valid command! Use " + prefix + "help for a list of valid commmands.");
					}
				}
			
				if(msg.content.toLowerCase() == 'ping'){
					msg.reply('pong');
					msg.react(((Math.random()*100)+1 > 50) ? client.emojis.find("name","kcolon") : client.emojis.find("name","wherestheweed"));
				}
			}
		});
		client.login(defaultsPackage[0]);
	}
});

function getTOA_Stats(apiSubRoutine, callback){
	
	var options = {
		url: 'http://www.theorangealliance.org/api' + apiSubRoutine,
		headers: {
			'X-Application-Origin': 'Smida Syndicate',
			'X-TOA-Key': defaultsPackage[1]
		}
	}
	
	request.get(options, callback);
}