import { Client, Events, GatewayIntentBits } from 'discord.js'
import 'dotenv/config'
import PocketBase from 'pocketbase';

const token = process.env.DISCORD_TOKEN

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent],
})

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

const pb = new PocketBase(process.env.POCKETBASE_URL)

client.on(Events.MessageCreate, async (message) => {
	if(message.author.id === process.env.DISCORD_USER_ID) {
    const authData = await pb.admins.authWithPassword(process.env.POCKETBASE_EMAIL, process.env.POCKETBASE_PASSWORD);

    if(authData && pb.authStore.isValid) {
      const data = {
        content: message.content,
      }
      
      try {
        const record = await pb.collection('posts').create(data);
        message.react('🟢');
      } catch (error) {
        console.log(error)
        message.react('🔴');
      }

      
    }
    
  }
});


client.login(token);

