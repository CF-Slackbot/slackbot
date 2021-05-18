"use strict";

require("dotenv").config();
// const { WebClient } = require("@slack/web-api");
// const { createEventAdapter } = require("@slack/events-api");
const axios = require("axios");

const callBot = require("./src/blockkit/callBot");

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_TOKEN;
const PORT = process.env.SLACK_PORT || 3000;

// const slackEvents = createEventAdapter(slackSigningSecret);
// const slackClient = new WebClient(slackToken);

const { App, LogLevel } = require("@slack/bolt");

const app = new App({
  token: slackToken,
  signingSecret: slackSigningSecret,
  logLevel: LogLevel.DEBUG,
});

app.action("static_select-action", async ({ ack, body, payload, say }) => {
  await ack();
  await say(
    `Awesome! Let's start with 5 ${payload.selected_option.value} questions`
  );
  console.log("=======BODY=======", body);
  console.log("=======PAYLOAD=======", payload);
  // getProblems(payload);
  getRandomProblem(payload, 5);
});

async function getProblems(payload) {
  try {
    const url = `${process.env.QUESTION_URL}?category=${payload.selected_option.value}`;
    // const url = process.env.QUESTION_URL
    const questions = await axios.get(url);
    // return JSON.parse(questions.data)
    console.log("get problems", questions.data);
  } catch (e) {
    console.error(e);
  }
}

async function getRandomProblem(payload, num) {
  const url =
    payload.selected_option.value === "All"
      ? `${process.env.QUESTION_URL}?category=${payload.selected_option.value}`
      : `${process.env.QUESTION_URL}/search?category=${payload.selected_option.value}`;
  const questions = await axios.get(url);
  let qArr = questions.data;
  let x = qArr.sort(() => Math.random() - Math.random()).slice(0, num);
  console.log("getting qs", x);
  // return value?
}

// Format imported random problems into questions with multiple choice

app.message(async ({ message, say }) => {
  await callBot(message);
});

(async () => {
  await app.start(PORT);
  console.log("⚡️ Bolt app is running!");
})();
