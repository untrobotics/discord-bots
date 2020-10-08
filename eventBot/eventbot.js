module.exports.eventbotHandler= eventbotHandler = (msg)=>{
    console.log(msg.content);
    msg.reply("I'm the eventBot");
}