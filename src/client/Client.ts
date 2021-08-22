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
import Event from '../interfaces/EventStorage';

const globPromise = promisify(glob);

export default class Bot extends Client {
  // readonly members
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
