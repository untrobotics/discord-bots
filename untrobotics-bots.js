#!/usr/bin/env nodejs
const Discord = require('discord.js')
const config = require('dotenv').config().parsed
const fetch = require('node-fetch');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    // construct the regular express to look for the format !space <number>
    // [ ]* means match any (zero or more) spaces
    // ^ means start at the beginning of the string
    // $ means end at the end of the string (using ^ and $ means the WHOLE string must match, no partial matches are allowed)
    // \d means look for a digit, \d+ means one or more digits
    // (whatever) means store <whatever> inside of the matches variable, if a match is made
    // ? at the end of (whatever) means it is okay to not find any digits (i realise now I should've \d* for zero or more digits...)
    const regex = new RegExp("^" + config.PREFIX + "space[ ]*(\\d+)?$"); // construct the regular express to look for the format !space <number>
    const matches = msg.content.match(regex);

    if (matches) {
        let count = matches.length > 1 ? parseInt(matches[1]) : 1;
        if (isNaN(count)) {
            count = 1;
        }

        if (count > 99) {
            count = 99;
        }

        fetch(`https://launchlibrary.net/1.4/launch/next/${count}`)
            .then(response => response.json())
            .then(data => {

            let responses = [];

            const launches = data.launches;
            launches.forEach((launch, index) => {
                responses[index] =
                    "Upcoming launch **#" + (index+1) + "** is a " + launch.name + " rocket, " +
                    "launching at: " + launch.net + "\n";
                if (launch.missions.length) {
                    responses[index] += "Mission: " + launch.missions[0].description + "\n";
                } else {
                    responses[index] += "Mission: *UNKNOWN* (classified/spooky)\n";
                }
            });

            let character_count = 0;
            let last_index_sent = -1;
            responses.forEach((response, index) => {
                character_count += response.length;
                if (character_count > config.CHARACTER_LIMIT) {
                    // send indices from last_index_sent to previous, .slice is (-]
                    msg.reply(responses.slice(last_index_sent+1, index).join("\n"));

                    last_index_sent = index-1;
                    character_count = response.length;
                }
            });

            msg.reply(responses.slice(-1*(responses.length - last_index_sent)).join("\n"));
        });
    }
});

client.login(config.BOT_TOKEN);
