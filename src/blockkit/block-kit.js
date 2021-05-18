"use strict";

const takeQuiz = () => {
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Want to sharpen your developer skills? Take a short 10 question quiz!",
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Choose a focus area:",
        },
        accessory: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            emoji: true,
            text: "Manage",
          },
          options: [
            {
              text: {
                type: "plain_text",
                emoji: true,
                text: "HTML",
              },
              value: "html",
            },
            {
              text: {
                type: "plain_text",
                emoji: true,
                text: "CSS",
              },
              value: "css",
            },
            {
              text: {
                type: "plain_text",
                emoji: true,
                text: "JavaScript",
              },
              value: "javascript",
            },
          ],
        },
      },
      // {
      //   "type": "section",
      //   "text": {
      //     "type": "mrkdwn",
      //     "text": "Choose a difficulty level:"
      //   },
      //   "accessory": {
      //     "type": "static_select",
      //     "placeholder": {
      //       "type": "plain_text",
      //       "emoji": true,
      //       "text": "Manage"
      //     },
      //     "options": [
      //       {
      //         "text": {
      //           "type": "plain_text",
      //           "emoji": true,
      //           "text": "Easy"
      //         },
      //         "value": "easy"
      //       },
      //       {
      //         "text": {
      //           "type": "plain_text",
      //           "emoji": true,
      //           "text": "Medium"
      //         },
      //         "value": "medium"
      //       },
      //       {
      //         "text": {
      //           "type": "plain_text",
      //           "emoji": true,
      //           "text": "Hard"
      //         },
      //         "value": "hard"
      //       }
      //     ]
      //   }
      // },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              emoji: true,
              text: "Let's Go!",
            },
            style: "primary",
            value: "start",
          },
        ],
      },
    ],
  };
};

module.exports = takeQuiz;