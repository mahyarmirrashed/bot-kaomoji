import {
  inlineCode,
  SlashCommandBuilder,
  SlashCommandIntegerOption,
  SlashCommandStringOption,
} from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { cyan } from 'chalk';
import consola, { Consola } from 'consola';
import { Routes } from 'discord-api-types/v9';
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
import * as file from '../../data/kaomojis.json';
import Kaomoji from '../types/Kaomoji';

const globPromise = promisify(glob);

const MAXIMUM_OPTIONS = 25;

export default class Bot extends Client {
  // readonly members
  public readonly events: Collection<string, Event> = new Collection();
  public readonly kaomojis: Collection<string, string | readonly string[]>;
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
      .login(process.env.DISCORD_TOKEN as string)
      .catch((e: unknown) => this.logger.error(e));

    // load Kaomojis
    this.kaomojis = new Collection<string, string | readonly string[]>();
    (file.kaomojis as Kaomoji[]).forEach((kaomoji: Kaomoji) =>
      this.kaomojis.set(kaomoji.name, kaomoji.data),
    );
  }

  public start(): void {
    // register events
    globPromise(`${__dirname}/../events/**/*{.ts,.js}`)
      .then((events: string[]) => {
        events.map(async (eventPath: string) => {
          import(eventPath).then((event: Event) => {
            this.logger.info(`Registering event ${cyan(event.name)}...`);
            this.events.set(event.name, event);
            this.on(event.name, event.run.bind(null, this));
          });
        });
      })
      .catch((e: unknown) => this.logger.error(e));

    // register kaomoji slash commands
    new REST({ version: '9' })
      .setToken(process.env.DISCORD_TOKEN as string)
      .put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID as string,
          process.env.GUILD_ID as string,
        ),
        {
          body: [...this.kaomojis.entries()].flatMap<
            ReturnType<SlashCommandBuilder['toJSON']>
          >(([name, data]: [string, string | readonly string[]]) =>
            Array.isArray(data) && data.length > 1
              ? // variant case
                new SlashCommandBuilder()
                  .setName(name)
                  .setDescription(
                    `Appends ${data[0]} or a variant to your message.`,
                  )
                  .setDefaultPermission(true)
                  .addIntegerOption((option: SlashCommandIntegerOption) =>
                    option
                      .setName('variant')
                      .setDescription(
                        `Desired variant of ${inlineCode(name)} kaomoji`,
                      )
                      .addChoices(
                        data
                          // slash commands can only have 25 options
                          .slice(0, MAXIMUM_OPTIONS)
                          .map((datum: string, index: number) => [
                            datum,
                            index,
                          ]),
                      ),
                  )
                  .addStringOption((option: SlashCommandStringOption) =>
                    option.setName('message').setDescription('Your message'),
                  )
                  .toJSON()
              : // no variant case
                new SlashCommandBuilder()
                  .setName(name)
                  .setDescription(`Appends ${data} to your message.`)
                  .setDefaultPermission(true)
                  .addStringOption((option: SlashCommandStringOption) =>
                    option.setName('message').setDescription('Your message'),
                  )
                  .toJSON(),
          ),
        },
      )
      .then(() =>
        this.logger.success(
          'Successfully registered all application commands!',
        ),
      )
      .catch((e: unknown) => this.logger.error(e));
  }
}
