import Discord, {ButtonBuilder, ButtonStyle} from "discord.js"
import {IServer} from "../../../../models/server";
import {ComponentType} from "discord-api-types/v10"

module.exports = {
    commands: ["support_list"],
    minArgs: 0,
    maxArgs: 0,
    callback: async (message: Discord.Message, server: IServer) => {
        const guild = message.guild;
        if (!guild) {
            return;
        }

        const supportEntries: Array<readonly [string, string]> = Array.from(server.supportAnswers, ([id, answer]) => ([id, answer]))
        const supportPages: Map<number, Map<string, string>> = new Map();

        let pageNumber = 1;
        for (let i = 1; i <= supportEntries.length; i += 5) {
            supportPages.set(pageNumber, new Map(supportEntries.slice(i - 1, i + 4)))
            pageNumber++
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle("List of support options")
            .setColor("#ff0000")
            .setThumbnail("https://images-ext-2.discordapp.net/external/QOCCliX2PNqo717REOwxtbvIrxVV2DZ1CRc8Svz3vUs/https/collegekingsgame.com/wp-content/uploads/2020/08/college-kings-wide-white.png");

        const firstPage = supportPages.get(1) as Map<string, string>
        for (const [id, answer] of firstPage) {
            embed.spliceFields(-1, 0, {name: id, value: answer});
        }

        const nextPage = new Discord.ButtonBuilder()
            .setCustomId("next-page")
            .setLabel("Next Page")
            .setStyle(ButtonStyle.Primary)

        const previousPage = new Discord.ButtonBuilder()
            .setCustomId("prev-page")
            .setLabel("Previous Page")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        if (supportPages.size <= 1) {
            nextPage.setDisabled(true);
        }

        const row = new Discord.ActionRowBuilder<ButtonBuilder>()
            .addComponents(nextPage, previousPage)

        const msg = await message.channel.send({embeds: [embed], components: [row]});

        const filter = (interaction: Discord.MessageComponentInteraction) => (
            ["next-page", "prev-page"].includes(interaction.customId) &&
            interaction.user.id == message.author.id);

        const collector = msg.createMessageComponentCollector({filter, componentType: ComponentType.Button})

        pageNumber = 1;
        collector.on("collect", (i) => {
            if (i.customId == "next-page") {
                pageNumber++;
                previousPage.setDisabled(false);

                const embed = new Discord.EmbedBuilder()
                    .setTitle("List of support options")
                    .setColor("#ff0000")
                    .setThumbnail("https://images-ext-2.discordapp.net/external/QOCCliX2PNqo717REOwxtbvIrxVV2DZ1CRc8Svz3vUs/https/collegekingsgame.com/wp-content/uploads/2020/08/college-kings-wide-white.png");

                const supportPage = supportPages.get(pageNumber) as Map<string, string>
                console.log(supportPage)
                for (const [id, answer] of supportPage) {
                    embed.spliceFields(-1, 0, {name: id, value: answer});
                }

                if (pageNumber >= supportPages.size) {
                    nextPage.setDisabled(true);
                }

                const row = new Discord.ActionRowBuilder<ButtonBuilder>()
                    .addComponents(nextPage, previousPage)

                i.update({embeds: [embed], components: [row]})
            }

            if (i.customId == "prev-page") {
                pageNumber--;

                const embed = new Discord.EmbedBuilder()
                    .setTitle("List of support options")
                    .setColor("#ff0000")
                    .setThumbnail("https://images-ext-2.discordapp.net/external/QOCCliX2PNqo717REOwxtbvIrxVV2DZ1CRc8Svz3vUs/https/collegekingsgame.com/wp-content/uploads/2020/08/college-kings-wide-white.png");

                const supportPage = supportPages.get(pageNumber) as Map<string, string>
                for (const [id, answer] of supportPage) {
                    embed.spliceFields(-1, 0, {name: id, value: answer});
                }

                if (pageNumber <= 1) {
                    previousPage.setDisabled(true);
                }

                const row = new Discord.ActionRowBuilder<ButtonBuilder>()
                    .addComponents(nextPage, previousPage)

                i.update({embeds: [embed], components: [row]})
            }
        })

        collector.on("end", (_collected, reason) => {
            console.log("Ended collector", reason)
        })
    },
    requiredRoles: ["Support Team"]
}
