"use strict";

require("dotenv").config();
// const { WebClient } = require("@slack/web-api");
// const { createEventAdapter } = require("@slack/events-api");
const axios = require("axios");

const callBot = require("./src/blockkit/callBot");

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_TOKEN;
const PORT = process.env.SLACK_PORT || 3000;

// const sortedQuestionsArray = [];

// const slackEvents = createEventAdapter(slackSigningSecret);
// const slackClient = new WebClient(slackToken);

const { App, LogLevel } = require("@slack/bolt");

const app = new App({
  token: slackToken,
  signingSecret: slackSigningSecret,
  logLevel: LogLevel.DEBUG,
});

app.action("static_select-action", async ({ ack, body, payload, say, client }) => {
  await ack();
  // await say(`Awesome! Let's start with 5 ${payload.selected_option.value} questions`);
  // console.log("=======BODY=======", body);
  console.log("=======PAYLOAD=======", payload);
  // getProblems(payload);
  let questionsArray = await getRandomProblem(payload, 5);
  console.log('hurray hurray here is the questionsArray', questionsArray);
  // startQuizz(body.trigger_id, 5)

  try {
    // Call views.open with the built-in client
    for (let i = 0; i < questionsArray.length; i++) {
      const result = await client.views.open({
        // Pass a valid trigger_id within 3 seconds of receiving it
        trigger_id: body.trigger_id,
        // View payload
        view: {
          type: 'modal',
          // View identifier
          callback_id: 'view_1',
          title: {
            type: 'plain_text',
            text: 'Quiz'
          },
          blocks: [
            {
              "type": "divider"
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                // "text": "How would you access the value of `x` in the following code? \n ```foo = { a: b, c: [ z, y, x ] }```"
                "text": questionsArray[i].question,
              },
              "accessory": {
                "type": "image",
                "image_url": "https://www.dictionary.com/e/wp-content/uploads/2018/03/Thinking_Face_Emoji-Emoji-Island-300x300.png",
                "alt_text": "calendar thumbnail"
              }
            },
            {
              "type": "divider"
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": questionsArray[i].answers[i].answer_a,
              },
              "accessory": {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "emoji": true,
                  "text": "A"
                },
                "value": "click_me_123"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": questionsArray[i].answers[i].answer_b
              },
              "accessory": {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "emoji": true,
                  "text": "B"
                },
                "value": "click_me_123"
              }
            },
            questionsArray[i].answers[i].answer_c === !null ?
              { 
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": questionsArray[i].answers[i].answer_c
                },
                "accessory": {
                  "type": "button",
                  "text": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": "C"
                  },
                  "value": "click_me_123"
                }
              } : {},
            questionsArray[i].answers[i].answer_d === !null ?
              { 
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": 'questionsArray[0].answers[0].answer_d'
                },
                "accessory": {
                  "type": "button",
                  "text": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": "D"
                  },
                  "value": "click_me_123"
                }
              } : {}
          ],
          submit: {
            type: 'plain_text',
            text: 'Submit'
          }
        }
      });
    }
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

async function getProblems(payload) {
  try {
    const url = `${process.env.QUESTION_URL}?category=${payload.selected_option.value}`;
    // const url = process.env.QUESTION_URL
    const questions = await axios.get(url);
    // return JSON.parse(questions.data)
    // console.log("get problems", questions.data);
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
  // let x = qArr.sort(() => Math.random() - Math.random()).slice(0, num);
  let sortedQuestionsArray = qArr.sort(() => Math.random() - Math.random()).slice(0, num);
  // console.log("getting qs", sortedQuestionsArray);
  return sortedQuestionsArray
}
// async function startQuiz(message) {
// }
// Format imported random problems into questions with multiple choice

app.message(async ({ message, say }) => {
  await callBot(message);
});

app.action('static_select-action', async ({ message, say, ack }) => {
  // ack();
  console.log('yay we are in app event ============================>>>>>>>>>>>>>>>', message);
  // await startQuiz(message);
});

(async () => {
  await app.start(PORT);
  console.log("⚡️ Bolt app is running!");
})();
