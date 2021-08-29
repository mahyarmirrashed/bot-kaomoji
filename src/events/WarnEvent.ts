import Bot from '../client/Client';
import Handler from '../interfaces/HandlerStorage';

export const run: Handler<string> = async (
  client: Bot,
  warning: string,
): Promise<void> => {
  client.logger.info(warning);
};

export const name = 'warn';
