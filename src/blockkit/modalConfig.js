"use strict";

async function modalQs(ack, body, payload, client, questionsObject) {
  await ack();
  let blocks = [];
  let divider = { type: "divider" };
  let topic = payload.selected_option.value
  for (let i = 0; i < questionsObject.questionsArray.length; i++) {
    let section = {
      type: "section",
      text: {
        type: "mrkdwn",
        text: questionsObject.questionsArray[i].question,
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
              type: "mrkdwn",
              text: questionsObject.questionsArray[i].answers[0].answer_a,
            },
            value: "answer_a",
          },
          {
            text: {
              type: "mrkdwn",
              text: questionsObject.questionsArray[i].answers[0].answer_b,
            },
            value: "answer_b",
          },
        ],
        action_id: `radio_buttons-action${i}`,
      },
      label: {
        type: "plain_text",
        text: "Options",
        emoji: true,
      },
    };
    let answer3 = {
      text: {
        type: "mrkdwn",
        text: questionsObject.questionsArray[i].answers[0].answer_c,
      },
      value: "answer_c",
    };
    let answer4 = {
      text: {
        type: "mrkdwn",
        text: questionsObject.questionsArray[i].answers[0].answer_d,
      },
      value: "answer_d",
    };
    if (questionsObject.questionsArray[i].answers[0].answer_c !== null) {
      question.element.options.push(answer3);
    }
    if (questionsObject.questionsArray[i].answers[0].answer_d !== null) {
      question.element.options.push(answer4);
    }
    blocks.push(divider);
    blocks.push(section);
    blocks.push(question);
  }
  try {
    // Call views.open with the built-in client
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
          text: `Quiz on ${topic}`,
        },
        blocks: blocks,
        submit: {
          type: "plain_text",
          text: "Submit",
        },
      },
    });
    return questionsObject;
  } catch (error) {
    console.error(error);
  }
}

module.exports = modalQs;
