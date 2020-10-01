module.exports.eventbotHandler= eventbotHandler = (msg)=>{
    msg.reply("I'm the eventBot");
    console.log(msg.content);
}