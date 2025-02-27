import Discord from "discord.js"
import {ImageConfig} from "../../../../models/image-config";

module.exports = {
    commands: ["add_personal"],
    expectedArgs: "<category>, <image_link>",
    minArgs: 2,
    maxArgs: 2,
    callback: async (message: Discord.Message, server: unknown, args: string[]) => {
        const userId = message.author.id

        if (userId != "211486447369322506") {
            return;
        }

        const imageLink = args[1]

        const imageConfig = await ImageConfig.findOne({category: args[0]}).exec()

        if (!imageConfig) {
            await message.reply("Category not found in image config.")
            return;
        }

        const globalImages = new Set(imageConfig.global)
        const userImages = new Set(imageConfig.users?.get(userId))

        userImages.add(imageLink)
        globalImages.add(imageLink)

        imageConfig.users?.set(userId, [...userImages])
        imageConfig.global = [...globalImages]

        await Promise.all([
            imageConfig.save(),
            message.reply(`Successfully added "${imageLink}" to ${message.author} images`)
        ])
    },
}
