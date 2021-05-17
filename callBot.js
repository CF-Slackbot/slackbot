'use strict'

const { WebClient } = require("@slack/web-api");

const slackToken = process.env.SLACK_TOKEN;
const slackClient = new WebClient(slackToken);

const takeQuiz = require('./block-kit')
const block = require('./json-block.json')


function callBot(event) {
    console.log(`Got message from user ${event.user}: ${event.text}`);
    console.log("we made it - fuck yes");
    if (
      event.text.includes("Yes") ||
      event.text.includes("yes") ||
      event.text.includes("Y") ||
      event.text.includes("y")
    ) {
      (async () => {
        if (!event.bot_id) {
          try {
            await slackClient.chat.postMessage({
              channel: event.channel,
              text: `Hello <@${event.user}> HERE IS YOUR FIRST QUESTION blahblahblah :tada:`,
              blocks:block
            });
          } catch (error) {
            console.log(error.data);
          }
        }
      })();
    } else {
      (async () => {
        if (!event.bot_id) {
          try {
            await slackClient.chat.postMessage({
              channel: event.channel,
              text: `Hello <@${event.user}> would you like to take the quiz to improve your coding knowledge. It's a lot of fun. Reply with YES or Y :tada:`,
            });
          } catch (error) {
            console.log(error.data);
          }
        }
      })();
    }
  }
  
  module.exports = callBot