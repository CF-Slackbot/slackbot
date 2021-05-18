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
    // try {
    //   // Call views.open with the built-in client

    //   await client.views.open({
    //     // Pass a valid trigger_id within 3 seconds of receiving it
    //     trigger_id: body.trigger_id,
    //     // View payload
    //     view: {
    //       type: "modal",
    //       // View identifier
    //       callback_id: "view_1",
    //       title: {
    //         type: "plain_text",
    //         text: "Modal title",
    //       },
    //       blocks: [
    //         {
    //           type: "divider",
    //         },
    //         {
    //           type: "section",
    //           text: {
    //             type: "mrkdwn",
    //             text: questionsArray[0].question,
    //           },
    //           accessory: {
    //             type: "image",
    //             image_url:
    //               "https://www.dictionary.com/e/wp-content/uploads/2018/03/Thinking_Face_Emoji-Emoji-Island-300x300.png",
    //             alt_text: "calendar thumbnail",
    //           },
    //         },
    //         {
    //           type: "divider",
    //         },
    //         {
    //           type: "input",
    //           block_id: "input_block",
    //           element: {
    //             type: "radio_buttons",
    //             options: [
    //               {
    //                 text: {
    //                   type: "plain_text",
    //                   text: questionsArray[0].answers[0].answer_a,
    //                   emoji: true,
    //                 },
    //                 value: "answer_a",
    //               },
    //               {
    //                 text: {
    //                   type: "plain_text",
    //                   text: questionsArray[0].answers[0].answer_b,
    //                   emoji: true,
    //                 },
    //                 value: "answer_b",
    //               },
    //               {
    //                 text: {
    //                   type: "plain_text",
    //                   text: questionsArray[0].answers[0].answer_c,
    //                   emoji: true,
    //                 },
    //                 value: "answer_c",
    //               },
    //             ],
    //             action_id: "radio_buttons-action",
    //           },
    //           label: {
    //             type: "plain_text",
    //             text: "Label",
    //             emoji: true,
    //           },
    //         },
    //       ],
    //       submit: {
    //         type: "plain_text",
    //         text: "Submit",
    //       },
    //     },
    //   });
    // } catch (error) {
    //   console.error(error);
    // }
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

  if (val === ans) {
    await client.chat.postMessage({
      channel: user,
      text: "You got it right!",
    });
  } else {
    await client.chat.postMessage({
      channel: user,
      text: "Better luck next time!",
    });
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
