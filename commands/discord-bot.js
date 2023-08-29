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
  const yamatoInfoBotClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.DirectMessageTyping,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildScheduledEvents,
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
  
  yamatoInfoBotClient.on("ready", async () => {
    setInterval(async () => {
      try {
        const guild = yamatoInfoBotClient.guilds.cache.get(
          process.env.DISCORD_CHANNEL_ID
        );
        const bot = await guild.members.fetch(
          process.env.DISCORD_YAMATO_INFO_BOT_ID
        );
        const ABI = require("./../abi/Yamato.json");
        const YAMATOcontract = new ethers.Contract(
          "0x02Fe72b2E9fF717EbF3049333B184E9Cd984f257", //Yamato contract address
          ABI,
          provider
        );
        const allYamatoStates = await YAMATOcontract.getStates();
        
        const totalCollateralETH = allYamatoStates[0] / 10 ** 18;
        console.log(totalCollateralETH);
        await bot.setNickname(`総担保 : Ξ ${totalCollateralETH} ETH`);

        const totalSupplyCJPY = allYamatoStates[1] / 10 ** 18;
        console.log(totalSupplyCJPY.toLocaleString());
        await yamatoInfoBotClient.user.setActivity(`総発行: ${totalSupplyCJPY.toLocaleString()} CJPY`);

      } catch (err) {
        console.log(err.name + ": " + err.message);
      }
    }, intervalTime);
  });

  const yamatoInfoBot2Client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.DirectMessageTyping,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildScheduledEvents,
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

  yamatoInfoBot2Client.on("ready", async () => {
    setInterval(async () => {
      try {
        const guild = yamatoInfoBot2Client.guilds.cache.get(
          process.env.DISCORD_CHANNEL_ID
        );
        const bot = await guild.members.fetch(
          process.env.DISCORD_YAMATO_INFO_BOT2_ID
        );
        const ABI = require("./../abi/PriorityRegistryV6.json");
        const PriorityRegistryV6contract = new ethers.Contract(
          "0x0c9Bdf09de9EaCbE692dB2c17a75bfdB5FF4190B", //PriorityRegistryV6 contract address
          ABI,
          provider
        );
        const ABI2 = require("./../abi/Yamato.json");
        const YAMATOcontract = new ethers.Contract(
          "0x02Fe72b2E9fF717EbF3049333B184E9Cd984f257", //Yamato contract address
          ABI2,
          provider
        );
        const ABI3 = require("./../abi/PriceFeedV3.json");
        const yamatoPriceFeedContract = new ethers.Contract(
          "0x3f4E4Dad0AC01Da50A774F3389b70506c96FfF2f", //Price Feed contract address
          ABI3,
          provider
        );

        const allYamatoStates = await YAMATOcontract.getStates();

        const rateOfEthJpy = Number(
          formatYen(await yamatoPriceFeedContract.getPrice())
        );
        
        const totalCollateralETH = allYamatoStates[0] * rateOfEthJpy / 10 ** 18;//18924045.2508;//allYamatoStates[0] / 10 ** 18;
        const totalSupplyCJPY = allYamatoStates[1] / 10 ** 18;
        const tcr = totalSupplyCJPY === 0 ? 0 : (totalCollateralETH / totalSupplyCJPY * 100).toFixed(2);
        console.log(tcr+'%');

        await bot.setNickname(`TCR: ${tcr}%`);

        var redeemablesCandidate = await PriorityRegistryV6contract.getRedeemablesCap();
        // redeemablesCandidate = 10000000000000000000; // for test
        console.log('original: ' + redeemablesCandidate);
        if(redeemablesCandidate !== 0) redeemablesCandidate = redeemablesCandidate / 10 ** 18;
        console.log('culculated: ' + redeemablesCandidate);

        await yamatoInfoBot2Client.user.setActivity(`償還候補: ${redeemablesCandidate} CJPY`);

        // tcr:
        // mockState.totalDebt > 0
        //   ? ((mockState.totalCollateral * mockState.rateOfEthJpy) /
        //       mockState.totalDebt) *
        //     100
        //   : 0,

        // totalCollateralETH = allYamatoStates[0] / 10 ** 18;
        // console.log(totalCollateralETH);
        // await yamatoInfoBotClient.user.setActivity(`ETH（総担保）: ${totalCollateralETH}`);
        
      } catch (err) {
        console.log(err.name + ": " + err.message);
      }
    }, intervalTime);
  });

  const yamatoInfoBot3Client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.DirectMessageTyping,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildScheduledEvents,
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

  yamatoInfoBot3Client.on("ready", async () => {
    setInterval(async () => {
      try {
        const guild = yamatoInfoBot3Client.guilds.cache.get(
          process.env.DISCORD_CHANNEL_ID
        );
        const bot = await guild.members.fetch(
          process.env.DISCORD_YAMATO_INFO_BOT3_ID
        );

        const res = await fetch(
          "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=GZWY0Y5XMJ7WM66A"
        );
        const resJSON = await res.json();
        const jpyPerUSD = resJSON['Realtime Currency Exchange Rate']['5. Exchange Rate'];
        const jpyPerUSDToFixed = Number(jpyPerUSD).toFixed(2);
        console.log(jpyPerUSDToFixed);

        //await bot.setNickname(`1ドル = ${jpyPerUSDToFixed}円`);

        const res2 = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=convertible-jpy-token&vs_currencies=jpy"
        );
        const resJSON2 = await res2.json();
        const cjpyPerJPY = Number(resJSON2['convertible-jpy-token']['jpy']);
        const diff = ((cjpyPerJPY-1)*100).toFixed(2);
        console.log('test:'+ diff + '%');

        const cjpyPerUSDToFixed = (jpyPerUSDToFixed / cjpyPerJPY).toFixed(2);
        console.log(cjpyPerUSDToFixed);

        //const diff = (jpyPerUSDToFixed - cjpyPerUSDToFixed).toFixed(2);
        let plusDiff;

        if(diff > 0){
          plusDiff = "+"+diff;
          console.log(plusDiff);
          await bot.setNickname(`為替差異: ${plusDiff}%`);
        }else{
          console.log(diff);
          await bot.setNickname(`為替差異: ${diff}%`);
        }

        await yamatoInfoBot3Client.user.setActivity(`円: ${jpyPerUSDToFixed}・CJPY: ${cjpyPerUSDToFixed}`);

        // await bot.setNickname(`円: ${jpyPerUSDToFixed} CJPY: ${cjpyPerUSDToFixed}`);
        // await yamatoInfoBot3Client.user.setActivity(`為替差異: ${diff}`);

      } catch (err) {
        console.log(err.name + ": " + err.message);
      }
    }, intervalTime);
  });

  yamatoInfoBotClient.login(process.env.DISCORD_YAMATO_INFO_BOT_TOKEN);
  yamatoInfoBot2Client.login(process.env.DISCORD_YAMATO_INFO_BOT2_TOKEN);
  yamatoInfoBot3Client.login(process.env.DISCORD_YAMATO_INFO_BOT3_TOKEN);
};

module.exports = discordBotRun;