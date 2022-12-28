
const TelegramApi = require('node-telegram-bot-api');

const token ='5658462248:AAEIkQiO300ktO7oJRclPy4n-W5pd5fAyj8';
const {gameOptions, againtOptions} = require('./options');
const bot = new TelegramApi(token, {polling: true})

const chats = {}

const gameOptions= {
 reply_markup: JSON.stringify({
  inline_keyboard: [
      [{text: '1',callback_data: '1'}, {text: '2',callback_data: '2'}, {text: '3',callback_data: '3'}],
      [{text: '4',callback_data: '4'}, {text: '5',callback_data: '5'}, {text: '6',callback_data: '6'}],
      [{text: '7',callback_data: '7'},{text: '8',callback_data: '8'},{text: '9',callback_data: '9'}],
      [{text: '0',callback_data: '0'}],
  ]
 })
}

const againOptions= {
 reply_markup: JSON.stringify({
  inline_keyboard: [
   [{text: 'Play again',callback_data: '/again'}],
  ]
 })
}

const startGame = async (chatId) =>{
 await bot.sendMessage(chatId, `I will imagine a number from 0 to 9, and you should guess the number`);
 const randomNumber = Math.floor(Math.random() * 10);
 chats[chatId] = randomNumber;
 await bot.sendMessage(chatId, `Guess the number`, gameOptions);
}
const start = () => {
 bot.setMyCommands([
  {command: '/start', description: 'Introduction message'},
  {command: '/info', description: 'Get information about yourself'},
  {command: '/game', description: 'Play a guessing game'},
 ])

 bot.on('message', async msg=> {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (text === '/start'){
   await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/d06/e20/d06e2057-5c13-324d-b94f-9b5a0e64f2da/4.webp");
   return bot.sendMessage(chatId, `Welcome to the telegram bot `);
  }

  if (text === '/info'){
   return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name}`);
  }
  if (text === '/game'){
   return startGame(chatId);
  }
   return bot.sendMessage(chatId, `I do not understand you`);
 })
 bot.on('callback_query', msg =>{
  const data = msg.data;
  const chatId= msg.message.chat.id;
  if (data === '/again'){
   return startGame(chatId);
  }
  if (data === chats[chatId]){
   return bot.sendMessage(chatId, `Congratulations, you guessed the number ${chats[chatId]}`, againOptions)
  }else{
   return bot.sendMessage(chatId, `You lost, the number was ${chats[chatId]}`,againOptions)
  }
 })
}

start();