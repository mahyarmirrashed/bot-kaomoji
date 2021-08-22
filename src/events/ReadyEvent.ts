import Bot from '../client/Client';
import Runner from '../interfaces/RunnerStorage';

export const run: Runner = async (client: Bot): Promise<void> => {
  if (client.user) {
    client.logger.success(`${client.user.username} successfully logged in!`);
  } else {
    client.logger.error('`user` property on `client` was `null`...');
  }
};

export const name = 'ready';
