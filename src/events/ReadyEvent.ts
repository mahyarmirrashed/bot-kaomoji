import { Constants } from 'discord.js';
import { ActivityType, PresenceUpdateStatus } from 'discord-api-types/v9';
import Bot from '../client/Client';
import Handler from '../interfaces/HandlerStorage';

export const run: Handler = async (client: Bot): Promise<void> => {
  if (client.user) {
    // report sucessful login
    client.logger.success(`${client.user.username} successfully logged in!`);
    // set bot rich presence on servers
    client.user.setPresence({
      status: PresenceUpdateStatus.Online,
      afk: false,
      activities: [{ name: '/joy', type: ActivityType.Game }],
    });
  } else {
    client.logger.error('`user` property on `client` was `null`...');
  }
};

export const name = Constants.Events.CLIENT_READY;
