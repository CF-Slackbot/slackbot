'use strict';

require("dotenv").config();
const express = require('express')
const { App, LogLevel } = require("@slack/bolt");
const axios = require("axios");

const app = new App({
  token: process.env.SLACK_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG
});

const PORT = process.env.APP_PORT || 3001

app.action('radio_buttons-action', async ({ ack, body, payload, say }) => {
  await ack();
  await say(`Awesome! Let's start with 5 ${payload.selected_option.value} questions`)
  console.log("=======BODY=======", body)
  console.log("=======PAYLOAD=======",payload)
  getProblems(payload);
});

async function getProblems(payload){
  try{
    const url = `${process.env.QUESTION_URL}?category=${payload.selected_option.value}`
    // const url = process.env.QUESTION_URL
    const questions = await axios.get(url)
    // return JSON.parse(questions.data)
    console.log('get problems',questions.data)
  } catch(e){
    console.error(e)
  }
}

(async () => {
  await app.start(process.env.PORT ||  3001);
  console.log("⚡️ Bolt app is running!");
})();
