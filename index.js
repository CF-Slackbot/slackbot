"use strict";

const { WebClient } = require("@slack/web-api");
const { createEventAdapter } = require("@slack/events-api");
const axios = require("axios");
// const express = require('express')

const callBot = require('./callBot')

require("dotenv").config();

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_TOKEN;
const PORT = process.env.SLACK_PORT || 3000;

const slackEvents = createEventAdapter(slackSigningSecret);
const slackClient = new WebClient(slackToken);

slackEvents.on("app_mention", (event) => callBot(event));
slackEvents.on("message", (event) => callBot(event));


async function getProblems(){
  try{
    // const url = `${process.env.QUESTION_URL}?category=${e.target.value}`
    const url = process.env.QUESTION_URL
    const questions = await axios.get(url)
    return JSON.parse(questions.data)
    console.log('get problems',questions.data)
  } catch(e){
    console.error(e)
  }
}

getProblems()

// slackEvents.on("error", console.error);
// slackEvents.start(PORT).then(() => {
//   console.log(`Server on ${PORT}`);
// });
