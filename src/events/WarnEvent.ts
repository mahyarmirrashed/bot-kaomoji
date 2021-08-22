import Bot from '../client/Client';
import Runner from '../interfaces/RunnerStorage';

type WarnEventArgs = {
  warning: string;
};

export const run: Runner<WarnEventArgs> = async (
  client: Bot,
  args: WarnEventArgs,
): Promise<void> => {
  client.logger.info(args.warning);
};

export const name = 'warn';
