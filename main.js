'use strict';
const config5th = require("./config5th.json");
const config20th = require("./config20th.json");
const Bot = require('./Bot.js')

const bot5th = new Bot(config5th);
const bot2th = new Bot(config20th);