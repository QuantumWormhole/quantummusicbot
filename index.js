const {Client, RichEmbed, Message, VoiceConnection } = require('discord.js');
 
const bot = new Client();
 
const ytdl = require('ytdl-core')

var servers = {};

var version = "1.0"

const PREFIX = 'qm!';
 
bot.on('ready', () =>{
    console.log('Bot has come online.');
})
 


bot.on('message', message =>{
    if(message.content === (PREFIX+"Ping")){
        message.reply("Pong");

}
})
 
bot.on('message', message =>{
    if(message.content === (PREFIX+"ping")){
        message.reply("pong");

}
})

bot.on('message', message =>{
    if(message.content === (PREFIX+"Pong")){
        message.reply("Ping");

}
})
 
bot.on('message', message =>{
    if(message.content === (PREFIX+"pong")){
        message.reply("ping");

}
})

bot.on('message', message =>{
    if(message.content === (PREFIX+"version")){
        message.reply(version);

}
})


 
bot.on('message',message =>{

    let args = message.content.substring(PREFIX.length).split(' ');

    switch(args[0]){
        case 'play':

            function play(connection, message){
                var server = servers[message.guild.id];

                if(!server.queue[1]){

                    server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audio"}))}
                    server.dispatcher.on("finish",function(){
                            server.queue.shift()
                            if(server.queue[0]){
                                    play(connection,message)
                            }
                            else
                            {
                           server.queue.push(args[1]);
                            }
                    })
                        }


            if(!args[1]){
                message.channel.send("Please Provide A Link.");
                return;
            }

            if(!message.member.voice.channel){
                message.channel.send("Please Be In A Voice channel");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if(!message.member.voice.connection) message.member.voice.channel.join().then(function(connection){
                play(connection, message);
            })


        break;

        case 'skip':
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
            message.channel.send("Skipping The Song")
            break;

        case 'stop':
            var server = servers[message.guild.id];
            if(message.guild.VoiceConnection){
                for(var i = server.queue.length -1; i >=0; i){
                    server.queue.splice(i, 1);
                }

                server.dispatcher.end();
                message.channel.send("Stopping The Song")
                console.log('Stopped Queue')

            }

            if(message.guild.connection) message.guild.VoiceConnection.disconnect();
        break;

    }
});







bot.login(process.env.token);