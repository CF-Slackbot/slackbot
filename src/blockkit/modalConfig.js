'use strict'

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


async function modalQs (ack,body,payload,client){
    await ack()
    questionsArray = await getRandomProblem(payload, 5);

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
              text: "Modal title",
            },
            blocks: [
              {
                type: "divider",
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: questionsArray[0].question,
                },
                accessory: {
                  type: "image",
                  image_url:
                    "https://www.dictionary.com/e/wp-content/uploads/2018/03/Thinking_Face_Emoji-Emoji-Island-300x300.png",
                  alt_text: "calendar thumbnail",
                },
              },
              {
                type: "divider",
              },
              {
                type: "input",
                // block_id: "input_block",
                element: {
                  type: "radio_buttons",
                  options: [
                    {
                      text: {
                        type: "plain_text",
                        text: questionsArray[0].answers[0].answer_a,
                        emoji: true,
                      },
                      value: "answer_a",
                    },
                    {
                      text: {
                        type: "plain_text",
                        text: questionsArray[0].answers[0].answer_b,
                        emoji: true,
                      },
                      value: "answer_b",
                    },
                    {
                      text: {
                        type: "plain_text",
                        text: questionsArray[0].answers[0].answer_c,
                        emoji: true,
                      },
                      value: "answer_c",
                    },
                  ],
                //   action_id: "radio_buttons-action",
                },
                label: {
                  type: "plain_text",
                  text: "Label",
                  emoji: true,
                },
              },
              {
                type: "divider",
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: questionsArray[0].question,
                },
                accessory: {
                  type: "image",
                  image_url:
                    "https://www.dictionary.com/e/wp-content/uploads/2018/03/Thinking_Face_Emoji-Emoji-Island-300x300.png",
                  alt_text: "calendar thumbnail",
                },
              },
              {
                type: "divider",
              },
              {
                type: "input",
                // block_id: "input_block",
                element: {
                  type: "radio_buttons",
                  options: [
                    {
                      text: {
                        type: "plain_text",
                        text: questionsArray[0].answers[0].answer_a,
                        emoji: true,
                      },
                      value: "answer_a",
                    },
                    {
                      text: {
                        type: "plain_text",
                        text: questionsArray[0].answers[0].answer_b,
                        emoji: true,
                      },
                      value: "answer_b",
                    },
                    {
                      text: {
                        type: "plain_text",
                        text: questionsArray[0].answers[0].answer_c,
                        emoji: true,
                      },
                      value: "answer_c",
                    },
                  ],
                //   action_id: "radio_buttons-action",
                },
                label: {
                  type: "plain_text",
                  text: "Label",
                  emoji: true,
                },
              },
              {
                type: "divider",
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: questionsArray[0].question,
                },
                accessory: {
                  type: "image",
                  image_url:
                    "https://www.dictionary.com/e/wp-content/uploads/2018/03/Thinking_Face_Emoji-Emoji-Island-300x300.png",
                  alt_text: "calendar thumbnail",
                },
              },
              {
                type: "divider",
              },
              {
                type: "input",
                // block_id: "input_block",
                element: {
                  type: "radio_buttons",
                  options: [
                    {
                      text: {
                        type: "plain_text",
                        text: questionsArray[0].answers[0].answer_a,
                        emoji: true,
                      },
                      value: "answer_a",
                    },
                    {
                      text: {
                        type: "plain_text",
                        text: questionsArray[0].answers[0].answer_b,
                        emoji: true,
                      },
                      value: "answer_b",
                    },
                    {
                      text: {
                        type: "plain_text",
                        text: questionsArray[0].answers[0].answer_c,
                        emoji: true,
                      },
                      value: "answer_c",
                    },
                  ],
                //   action_id: "radio_buttons-action",
                },
                label: {
                  type: "plain_text",
                  text: "Label",
                  emoji: true,
                },
              },
              {
                type: "divider",
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: questionsArray[0].question,
                },
                accessory: {
                  type: "image",
                  image_url:
                    "https://www.dictionary.com/e/wp-content/uploads/2018/03/Thinking_Face_Emoji-Emoji-Island-300x300.png",
                  alt_text: "calendar thumbnail",
                },
              },
              {
                type: "divider",
              },
              {
                type: "input",
                // block_id: "input_block",
                element: {
                  type: "radio_buttons",
                  options: [
                    {
                      text: {
                        type: "plain_text",
                        text: questionsArray[0].answers[0].answer_a,
                        emoji: true,
                      },
                      value: "answer_a",
                    },
                    {
                      text: {
                        type: "plain_text",
                        text: questionsArray[0].answers[0].answer_b,
                        emoji: true,
                      },
                      value: "answer_b",
                    },
                    {
                      text: {
                        type: "plain_text",
                        text: questionsArray[0].answers[0].answer_c,
                        emoji: true,
                      },
                      value: "answer_c",
                    },
                  ],
                //   action_id: "radio_buttons-action",
                },
                label: {
                  type: "plain_text",
                  text: "Label",
                  emoji: true,
                },
              },
              {
                type: "divider",
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: questionsArray[0].question,
                },
                accessory: {
                  type: "image",
                  image_url:
                    "https://www.dictionary.com/e/wp-content/uploads/2018/03/Thinking_Face_Emoji-Emoji-Island-300x300.png",
                  alt_text: "calendar thumbnail",
                },
              },
              {
                type: "divider",
              },
              {
                type: "input",
                // block_id: "input_block",
                element: {
                  type: "radio_buttons",
                  options: [
                    {
                      text: {
                        type: "plain_text",
                        text: questionsArray[0].answers[0].answer_a,
                        emoji: true,
                      },
                      value: "answer_a",
                    },
                    {
                      text: {
                        type: "plain_text",
                        text: questionsArray[0].answers[0].answer_b,
                        emoji: true,
                      },
                      value: "answer_b",
                    },
                    {
                      text: {
                        type: "plain_text",
                        text: questionsArray[0].answers[0].answer_c,
                        emoji: true,
                      },
                      value: "answer_c",
                    },
                  ],
                //   action_id: "radio_buttons-action",
                },
                label: {
                  type: "plain_text",
                  text: "Label",
                  emoji: true,
                },
              },
              {
                type: "divider",
              },
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: questionsArray[0].question,
                },
                accessory: {
                  type: "image",
                  image_url:
                    "https://www.dictionary.com/e/wp-content/uploads/2018/03/Thinking_Face_Emoji-Emoji-Island-300x300.png",
                  alt_text: "calendar thumbnail",
                },
              },
              {
                type: "divider",
              },
              {
                type: "input",
                // block_id: "input_block",
                element: {
                  type: "radio_buttons",
                  options: [
                    {
                      text: {
                        type: "plain_text",
                        text: questionsArray[0].answers[0].answer_a,
                        emoji: true,
                      },
                      value: "answer_a",
                    },
                    {
                      text: {
                        type: "plain_text",
                        text: questionsArray[0].answers[0].answer_b,
                        emoji: true,
                      },
                      value: "answer_b",
                    },
                    {
                      text: {
                        type: "plain_text",
                        text: questionsArray[0].answers[0].answer_c,
                        emoji: true,
                      },
                      value: "answer_c",
                    },
                  ],
                //   action_id: "radio_buttons-action",
                },
                label: {
                  type: "plain_text",
                  text: "Label",
                  emoji: true,
                },
              },
            ],
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

module.exports=modalQs