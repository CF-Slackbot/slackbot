"use strict";

require("dotenv").config();

const axios = require("axios");

const callBot = require("./src/blockkit/callBot");
const modalQs = require("./src/blockkit/modalConfig")


const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_TOKEN;
const PORT = process.env.SLACK_PORT || 3000;

let questionsArray = [];

const { App, LogLevel } = require("@slack/bolt");

const app = new App({
  token: slackToken,
  signingSecret: slackSigningSecret,
  logLevel: LogLevel.DEBUG,
});

app.action(
  "static_select-action",
  async ({ ack, body, payload, say, client }) => {
    // await ack();
    // console.log("=======BODY=======", body);
    // console.log("=======PAYLOAD=======", payload);
    // questionsArray = await getRandomProblem(payload, 5);
    modalQs(ack,body,payload,client)
  }
);


app.view("view_1", async ({ ack, body, view, client }) => {
  await ack();
  const user = body["user"]["id"];
  const val =
    view["state"]["values"]["input_block"]["radio_buttons-action"][
      "selected_option"
    ]["value"];
  let ans = questionsArray.shift()["correct_answer"];


});


async function getRandomProblem(payload, num) {
  const url =
    payload.selected_option.value === "All"
      ? `${process.env.QUESTION_URL}?category=${payload.selected_option.value}`
      : `${process.env.QUESTION_URL}/search?category=${payload.selected_option.value}`;
  const questions = await axios.get(url);
  let qArr = questions.data;
  let sortedQuestionsArray = qArr
    .sort(() => Math.random() - Math.random())
    .slice(0, num);
  return sortedQuestionsArray;
}

app.message(async ({ message, say }) => {
  await callBot(message);
});


(async () => {
  await app.start(PORT);
  console.log("⚡️ Bolt app is running!");
})();
