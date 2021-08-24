import { config } from 'dotenv';
import * as KaomojiFile from '../data/kaomoji.json';
import Bot from './client/Client';
import Kaomoji from './types/Kaomoji';

// set up environment variables from .env file
config();

new Bot(KaomojiFile.kaomojis as ReadonlyArray<Kaomoji>).start();
