import { hyperlink } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import Bot from '../client/Client';
import Handler from '../interfaces/HandlerStorage';

export const run: Handler<Interaction> = async (
  client: Bot,
  interaction: Interaction,
): Promise<void> => {
  if (interaction.isCommand()) {
    if (client.kaomojis.has(interaction.commandName)) {
      interaction.reply(
        `${
          interaction.options.getString('message') || ''
        } ${client.kaomojis.get(interaction.commandName)}`,
      );
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

export const name = 'interactionCreate';
