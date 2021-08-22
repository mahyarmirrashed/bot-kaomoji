import { Client } from 'discord.js';

export default interface Runner<T = Record<string, never>> {
  (client: Client, args: T): Promise<void>;
}
