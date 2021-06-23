"use strict";

const axios = require("axios");

const api = "https://cf-slackbot-questions-api.herokuapp.com/api/v2/result";

let addResult = async (questions, incorrect, user) => {
  try {
    await axios.post(api, {
      user: user["name"],
      userID: user["id"],
      questions: questions,
      incorrectQ: incorrect,
      timestamp: new Date(),
    });
  } catch (e) {
    console.error(e);
  }
};

async function getResult(ack, body, view, questionsObject, client) {
  await ack();

  const user = body["user"]["id"];
  let wrong2 = [];
  let count = 0;
  let correct, userInput, internalAnswerObj;
  for (let i = 0; i < questionsObject.questionsArray.length; i++) {
    correct = questionsObject.questionsArray[i]["correct_answer"];
    userInput =
      view["state"]["values"][`input_block${i}`][`radio_buttons-action${i}`][
        "selected_option"
      ]["value"];
    internalAnswerObj = {
      question: questionsObject.questionsArray[i]["question"],
      userAnswer: questionsObject.questionsArray[i].answers[userInput],
      correctAnswer: questionsObject.questionsArray[i].answers[correct],
      category: questionsObject.questionsArray[i]["category"],
      difficulty: questionsObject.questionsArray[i]["difficulty"]
    };
    userInput === correct ? (count += 1) : wrong2.push(internalAnswerObj);
  }

  let header = {
    type: "header",
    text: {
      type: "plain_text",
      text: ":apple: Your Personalized Report ",
    },
  };

  let div = {
    type: "divider",
  };

  let result = {
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `You got ${count}/5 questions right :tada:`,
      },
    ],
  };

  let pracTopic = {
    type: "section",
    text: {
      type: "plain_text",
      text: "Keep practicing these topics:",
      emoji: true,
    },
  };

  let again = {
    type: "section",
    text: {
      type: "plain_text",
      text: "If you would like to take another quiz please type yes or y",
      emoji: true,
    },
  };

  let resultBlock = [header, div, result, div, pracTopic];

  for (let i = 0; i < wrong2.length; i++) {
    let incorrect = {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `:bulb: ${wrong2[i].question}`,
        },
        {
          type: "mrkdwn",
          text: `:eyes: This was the answer you put => ${wrong2[i].userAnswer} \n :white_check_mark: This is the correct answer => ${wrong2[i].correctAnswer}`,
        },
      ],
    };
    resultBlock.push(incorrect);
  }

  resultBlock.push(div);
  resultBlock.push(again);

  try {
    if (questionsObject.user === user) {
      await client.chat.postMessage({
        channel: user,
        text: "",
        blocks: resultBlock,
      });
    }
    addResult(questionsObject.questionsArray, wrong2, body["user"]);
  } catch (error) {
    console.error(error);
  }
}

module.exports = getResult;
