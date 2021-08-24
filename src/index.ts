import { Collection } from 'discord.js';
import { config } from 'dotenv';
import * as file from '../data/kaomoji.json';
import Bot from './client/Client';
import Kaomoji from './types/Kaomoji';

// set up environment variables from .env file
config();

new Bot(
  // create collection from list of kaomojis
  new Collection(
    ((file.kaomojis as ReadonlyArray<Kaomoji>) || []).map(
      (kaomoji: Kaomoji) => [kaomoji.name, kaomoji.data],
    ),
  ),
).start();
