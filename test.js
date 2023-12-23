const fetch = require("node-fetch");
const Discord = require("discord.js");
const { Client, GatewayIntentBits, Partials } = require('discord.js')
const numeral = require("numeral");
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_URL);
const intervalTime = 10 * 1000;//10 * 60 * 1000;

function formatYen(value) {
  return ethers.utils.formatEther(value);
}

const discordBotRun = () => {
  console.log(`executing discordBotRun`);

  const yamatoTestBotClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      
    ],
    partials: [
      Partials.User,
      Partials.Channel,
      Partials.GuildMember,
      Partials.Message,
      Partials.Reaction,
      Partials.GuildScheduledEvent,
      Partials.ThreadMember,
    ],
  })
  
  yamatoTestBotClient.on("ready", async () => {
    setInterval(async () => {
      try {
        const guild = yamatoTestBotClient.guilds.cache.get(
            process.env.DISCORD_CHANNEL_ID
        );
        // Check if guild is available before fetching members
        if (!guild) {
          console.error("Guild not found.");
          return;
        }

      } catch (err) {
        console.log(err.name + ": " + err.message);
      }
    }, intervalTime);
  });

  yamatoTestBotClient.login("MTE4Njk4Mjc3NTMwMDA0Njg0OA.GZgXuI.adClOckAMcfPEbbZP1q-3XQqHiIEU4q5lqStLM");
};

module.exports = discordBotRun;