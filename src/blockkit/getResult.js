"use strict";

async function getResult(ack, body, view, questionsArray, client) {
  await ack();
  const user = body["user"]["id"];
  let wrong2 = [];
  let count = 0;
  let correct, userInput, internalAnswerObj;
  for (let i = 0; i < questionsArray.length; i++) {
    correct = questionsArray[i]["correct_answer"];
    userInput =
      view["state"]["values"][`input_block${i}`][`radio_buttons-action${i}`][
        "selected_option"
      ]["value"];
    internalAnswerObj = {
      question: questionsArray[i]["question"],
      userAnswer: questionsArray[i].answers[0][userInput],
      correctAnswer: questionsArray[i].answers[0][correct],
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
    await client.chat.postMessage({
      channel: user,
      text: "",
      blocks: resultBlock,
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = getResult;
