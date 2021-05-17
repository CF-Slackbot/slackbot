"use strict";

require("dotenv").config();
const { WebClient } = require("@slack/web-api");
const { createEventAdapter } = require("@slack/events-api");

const callBot = require('./src/blockkit/callBot')

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_TOKEN;
const PORT = process.env.SLACK_PORT || 3000;

const slackEvents = createEventAdapter(slackSigningSecret);
const slackClient = new WebClient(slackToken);

slackEvents.on("app_mention", (event) => callBot(event));
slackEvents.on("message", (event) => callBot(event));

// getProblems()

slackEvents.on("error", console.error);
slackEvents.start(PORT).then(() => {
  console.log(`Server on ${PORT}`);
});
