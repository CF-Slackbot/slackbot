"use strict";

require("dotenv").config();
const { WebClient } = require("@slack/web-api");

const slackToken = process.env.SLACK_TOKEN;
const slackClient = new WebClient(slackToken);

const block = require("../json/radio.json");

function callBot(event) {
  console.log(`Got message from user ${event.user}: ${event.text}`);
  console.log("we made it - fuck yes");
  if (event.text.toLowerCase().startsWith("y")) {
    yes(event);
  } else if (event.text.toLowerCase().startsWith("n")) {
    no(event);
  } else {
    initiate(event);
  }
}

async function yes(event) {
  if (!event.bot_id) {
    try {
      await slackClient.chat.postMessage({
        channel: event.channel,
        text: "Place holding text",
        blocks: block,
      });
    } catch (error) {
      console.log(error.data);
    }
  }
}

async function no(event) {
  if (!event.bot_id) {
    try {
      await slackClient.chat.postMessage({
        channel: event.channel,
        text: `Okay maybe next time!`,
      });
    } catch (error) {
      console.log(error.data);
    }
  }
}

async function initiate(event) {
  if (!event.bot_id) {
    try {
      await slackClient.chat.postMessage({
        channel: event.channel,
        text: `Hello <@${event.user}> would you like to take the quiz to improve your coding knowledge. It's a lot of fun. Reply with YES or Y :tada:`,
      });
    } catch (error) {
      console.log(error.data);
    }
  }
}
module.exports = callBot;
