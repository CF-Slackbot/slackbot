"use strict";

const { WebClient } = require("@slack/web-api");
const { createEventAdapter } = require("@slack/events-api");
const axios = require("axios");

const takeQuiz = require('./block-kit')
const block = require('./json-block.json')

require("dotenv").config();

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_TOKEN;
const PORT = process.env.SLACK_PORT || 3000;

const slackEvents = createEventAdapter(slackSigningSecret);
const slackClient = new WebClient(slackToken);

slackEvents.on("app_mention", (event) => callBot(event));

slackEvents.on("message", (event) => callBot(event));

function callBot(event) {
  console.log(`Got message from user ${event.user}: ${event.text}`);
  if (
    event.text.includes("Yes") ||
    event.text.includes("yes") ||
    event.text.includes("Y") ||
    event.text.includes("y")
  ) {
    console.log("we made it - fuck yes");
    (async () => {
      if (!event.bot_id) {
        try {
          await slackClient.chat.postMessage({
            channel: event.channel,
            text: `Hello <@${event.user}> HERE IS YOUR FIRST QUESTION blahblahblah :tada:`,
            blocks:block
          });
        } catch (error) {
          console.log(error.data);
        }
      }
    })();
  } else {
    (async () => {
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
    })();
  }
}

slackEvents.on("error", console.error);
slackEvents.start(PORT).then(() => {
  console.log(`Server on ${PORT}`);
});
