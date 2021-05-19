"use strict";

const axios = require("axios");

let questionsArray = [];

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

async function modalQs(ack, body, payload, client) {
  await ack();
  questionsArray = await getRandomProblem(payload, 5);
  let blocks = [];
  let divider = { type: "divider" };
  for (let i = 0; i < questionsArray.length; i++) {
    let section = {
      type: "section",
      text: {
        type: "mrkdwn",
        text: questionsArray[i].question,
      },
      accessory: {
        type: "image",
        image_url:
          "https://www.dictionary.com/e/wp-content/uploads/2018/03/Thinking_Face_Emoji-Emoji-Island-300x300.png",
        alt_text: "calendar thumbnail",
      },
    };

    let question = {
      type: "input",
      block_id: `input_block${i}`,
      element: {
        type: "radio_buttons",
        options: [
          {
            text: {
              type: "plain_text",
              text: questionsArray[i].answers[0].answer_a,
              emoji: true,
            },
            value: "answer_a",
          },
          {
            text: {
              type: "plain_text",
              text: questionsArray[i].answers[0].answer_b,
              emoji: true,
            },
            value: "answer_b",
          },
        ],
      },
      label: {
        type: "plain_text",
        text: "Options",
        emoji: true,
      },
    };
    let answer3 = {
      text: {
        type: "plain_text",
        text: questionsArray[i].answers[0].answer_c,
        emoji: true,
      },
      value: "answer_c",
    };
    let answer4 = {
      text: {
        type: "plain_text",
        text: questionsArray[i].answers[0].answer_d,
        emoji: true,
      },
      value: "answer_d",
    };
    if (questionsArray[i].answers[0].answer_c !== null) {
      question.element.options.push(answer3);
    }
    if (questionsArray[i].answers[0].answer_d !== null) {
      question.element.options.push(answer4);
    }
    blocks.push(divider);
    blocks.push(section);
    blocks.push(question);
  }
  try {
    // Call views.open with the built-in client
    console.log("This is blocks", blocks);
    await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: "modal",
        // View identifier
        callback_id: "view_1",
        title: {
          type: "plain_text",
          text: "Quiz",
        },
        blocks: blocks,
        submit: {
          type: "plain_text",
          text: "Submit",
        },
      },
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = modalQs;
