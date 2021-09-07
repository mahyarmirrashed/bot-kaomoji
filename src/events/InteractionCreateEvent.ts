import { hyperlink } from '@discordjs/builders';
import { Constants, Interaction, Util } from 'discord.js';
import Bot from '../client/Client';
import Handler from '../interfaces/HandlerStorage';

export const run: Handler<Interaction> = async (
  client: Bot,
  interaction: Interaction,
): Promise<void> => {
  if (interaction.isCommand()) {
    if (client.kaomojis.has(interaction.commandName)) {
      const kaomoji = client.kaomojis.get(interaction.commandName);
      if (interaction.options.getInteger('variant') == null) {
        interaction.reply(
          `${
            interaction.options.getString('message') ?? ''
          } ${Util.escapeMarkdown(
            Array.isArray(kaomoji) ? kaomoji[0] : kaomoji,
          )}`,
        );
      } else {
        // print with variant
        interaction.reply(
          `${
            interaction.options.getString('message') ?? ''
          } ${Util.escapeMarkdown(
            (kaomoji as readonly string[])[
              interaction.options.getInteger('variant', true)
            ],
          )}`,
        );
      }
    } else {
      interaction.reply({
        content: `Houston, we found a bug! Please report it ${hyperlink(
          'here',
          'https://github.com/mahyarmirrashed/bot-kaomoji/issues/new?assignees=&labels=&template=bug_report.md',
        )} thanks!`,
      });
    }
  }
};

export const name = Constants.Events.INTERACTION_CREATE;
