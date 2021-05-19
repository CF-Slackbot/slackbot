"use strict";

require("dotenv").config();

const { App, LogLevel } = require("@slack/bolt");

const callBot = require("./src/blockkit/callBot");
const modalQs = require("./src/blockkit/modalConfig");
const getRandomProblem = require("./src/blockkit/getRandomProblem");
const results = require("./src/blockkit/getResult");

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_TOKEN;
const PORT = process.env.PORT || 3000;

const app = new App({
  token: slackToken,
  signingSecret: slackSigningSecret,
  logLevel: LogLevel.DEBUG,
});

let questionsArray = [];

app.action("static_select-action", async ({ ack, body, payload, client }) => {
  questionsArray = await getRandomProblem(payload, 5);
  modalQs(ack, body, payload, client, questionsArray);
});

app.view("view_1", async ({ ack, body, view, client }) => {
  results(ack, body, view, questionsArray, client);
});

app.message(async ({ message}) => {
  await callBot(message);
});

(async () => {
  await app.start(PORT);
  console.log("⚡️ Bolt app is running!");
})();
