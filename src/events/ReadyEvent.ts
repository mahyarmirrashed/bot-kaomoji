import { ActivityType, PresenceUpdateStatus } from 'discord-api-types/v9';
import Bot from '../client/Client';
import Runner from '../interfaces/RunnerStorage';

export const run: Runner = async (client: Bot): Promise<void> => {
  if (client.user) {
    // report sucessful login
    client.logger.success(`${client.user.username} successfully logged in!`);
    // set bot rich presence on servers
    client.user.setPresence({
      status: PresenceUpdateStatus.Online,
      afk: false,
      activities: [{ name: '/joy', type: ActivityType.Listening }],
    });
  } else {
    client.logger.error('`user` property on `client` was `null`...');
  }
};

export const name = 'ready';
