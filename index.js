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
  let internalStatsArray = [];
  let correct, userInput, internalAnswerObj;
  for (let i = 0; i < questionsArray.length; i++) {
    correct = questionsArray[i]["correct_answer"];
    userInput = view["state"]["values"][`input_block${i}`][`radio_buttons-action${i}`]["selected_option"]["value"];
    internalAnswerObj = {question: questionsArray[i]['question'], userAnswer: questionsArray[i].answers[0][userInput], correctAnswer: questionsArray[i].answers[0][correct]}
    if (userInput === correct) {
      // right.push({question:questionsArray[i]['question']});
      right.push(` \n ${questionsArray[i]['question']} 	:beer: `);
      internalStatsArray.push(internalAnswerObj)
      count += 1
    } else {
      // wrong.push({question:questionsArray[i]['question']})
      wrong.push(` \n ${questionsArray[i]['question']}  :pig: `);
      // internalStatsArray.push({question: questionsArray[i]['question'], userAnswer: userInput, correctAnswer: correct})
      internalStatsArray.push(internalAnswerObj)
    }
  }
  let msg = `Questions you got right ${right}! \n \n Questions you got wrong ${wrong}. \n \n You got ${count} right out of 5`
  try {
    await client.chat.postMessage({
      channel: user,
      text: msg
    });
  }
  catch (error) {
    console.error(error);
  }
  console.log("right", right);
  console.log("wrong", wrong);
  console.log("internalStatsArray", internalStatsArray);
});

app.message(async ({ message, say }) => {
  await callBot(message);
});
                                                           
(async () => {
  await app.start(PORT);
  console.log("⚡️ Bolt app is running!");
})();
