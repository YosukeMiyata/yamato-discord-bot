const Keyv = require('keyv');
const cache = new Keyv();
const cron = require("node-cron");

require("dotenv").config();

const express = require("express");
const router = express.Router();

const Big = require("big.js");
const TOTAL_COINS = Big(210000);

// const myWalletAddresses = [
//   "0x24dd242c3c4061b1fcaa5119af608b56afbaea95",
//   "0x153d9dd730083e53615610a0d2f6f95ab5a0bc01",
//   "0x4534f4968006ca9eca3bac922022c7ecba066e9e",
//   "0xdc94eeeb3260d0b9bf22849e8f5d236d286cdba1",
// ];
// const txjpAddress = "0x961dD84059505D59f82cE4fb87D3c09bec65301d";
// const uniV3NFTAddress = ["0xA9166690c35d900a57D2ec132C58291bC0678944"]; // add new V3 position address in array if any
// const balV1Contract = process.env.BALANCERV1_TOKEN_CONTRACT_ADDRESS;
// const balV2TokenContract = process.env.BALANCER_TOKEN_CONTRACT_ADDRESS;
// const balV2VaultContract = process.env.BALANCER_VAULT_CONTRACT_ADDRESS;
// const balV2PoolAddress = process.env.BALANCER_POOL_CONTRACT_ADDRESS
// const balancerV1Abi = require("./abi/balancerV1Token.json");
// const balancerV2TokenAbi = require("./abi/balancerV2Token.json");
// const balancerV2VaultAbi = require("./abi/balancer.json");
// const balanceOfAbi = require("./abi/balanceOf.json");

async function calculateAndCacheDaoBalance() {
  
  const sum = 0;

  await cache.set("daoBalance", sum.toNumber()); 

  console.log("Dao Balance calculated and cached.");
}

cron.schedule("0 * * * *", async () => {
  await calculateAndCacheDaoBalance();
});

module.exports = router;