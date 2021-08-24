import Bot from '../client/Client';
import Runner from '../interfaces/RunnerStorage';

export const run: Runner<string> = async (
  client: Bot,
  warning: string,
): Promise<void> => {
  client.logger.info(warning);
};

export const name = 'warn';
