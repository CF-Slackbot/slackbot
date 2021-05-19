"use strict";

const axios = require("axios");

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

module.exports = getRandomProblem