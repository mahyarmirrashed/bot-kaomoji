import consola, { Consola } from 'consola';
import {
  Client,
  Collection,
  Intents,
  LimitedCollection,
  Options,
} from 'discord.js';
import glob from 'glob';
import { promisify } from 'util';
import Command from '../interfaces/CommandStorage';
import Event from '../interfaces/EventStorage';

const globPromise = promisify(glob);

export default class Bot extends Client {
  // readonly members
  public readonly commands: Collection<string, Command> = new Collection();
  public readonly events: Collection<string, Event> = new Collection();
  public readonly logger: Consola = consola;

  public constructor() {
    super({
      // only need access to send and delete messages inside guild
      intents: [Intents.FLAGS.GUILD_MESSAGES],
      // caching options for threads and messages
      makeCache: Options.cacheWithLimits({
        // default thread sweeping behaviour
        ...Options.defaultMakeCacheSettings,
        // sweep messages every 5 minutes
        // remove messages not edited or created in last 30 minutes
        MessageManager: {
          sweepInterval: 300,
          sweepFilter: LimitedCollection.filterByLifetime({
            lifetime: 1800,
            getComparisonTimestamp: (e) =>
              e.editedTimestamp ?? e.createdTimestamp,
          }),
        },
      }),
    });

    // log into client
    super
      .login(process.env.DISCORD_BOT_TOKEN as string)
      .catch((e: unknown) => this.logger.error(e));
  }

  public start(): void {
    // register commands
    globPromise(`${__dirname}/../commands/**/*{.ts,.js}`)
      .then((commands: string[]) => {
        commands.map(async (commandPath: string) => {
          import(commandPath).then((command: Command) => {
            this.logger.info(`Registering command "${command.name}"...`);
            this.commands.set(command.name, command);
          });
        });
      })
      .catch((e: unknown) => this.logger.error(e));

    // register events
    globPromise(`${__dirname}/../events/**/*{.ts,.js}`)
      .then((events: string[]) => {
        events.map(async (eventPath: string) => {
          import(eventPath).then((event: Event) => {
            this.logger.info(`Registering event "${event.name}"...`);
            this.events.set(event.name, event);
            this.on(event.name, event.run.bind(null, this));
          });
        });
      })
      .catch((e: unknown) => this.logger.error(e));
  }
}
