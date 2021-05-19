"use strict";

require("dotenv").config();

const callBot = require("./src/blockkit/callBot");
const { modalQs, getRandomProblem } = require("./src/blockkit/modalConfig");

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_TOKEN;
const PORT = process.env.SLACK_PORT || 3000;

const { App, LogLevel } = require("@slack/bolt");

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
  await ack();
  const user = body["user"]["id"];
  let right = [];
  let wrong = [];
  let count = 0
  for (let i = 0; i < questionsArray.length; i++) {
    if (
      view["state"]["values"][`input_block${i}`][`radio_buttons-action${i}`][
        "selected_option"
      ]["value"] === questionsArray[i]["correct_answer"]
    ) {
      right.push({question:questionsArray[i]['question']});
      count += 1
    } else {
      wrong.push({question:questionsArray[i]['question']})
    }
    // vals.push(
    //   view["state"]["values"][`input_block${i}`][`radio_buttons-action${i}`][
    //     "selected_option"
    //   ]["value"]
    // );
    // ans.push(questionsArray[i]["correct_answer"]);
  }
  let msg = `Questions you got right ${right}! \n Questions you got wrong ${wrong}. \n You got ${count} right out of 5`
  try {
    await client.chat.postMessage({
      channel: user,
      text: msg
    });
  }
  catch (error) {
    console.error(error);
  }
  console.log("vals", vals);
  console.log("ans", ans);
});

app.message(async ({ message, say }) => {
  await callBot(message);
});

(async () => {
  await app.start(PORT);
  console.log("⚡️ Bolt app is running!");
})();
