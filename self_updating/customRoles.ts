import Discord from "discord.js"
import {ChannelType} from "discord-api-types/v10"

module.exports = async function (client: Discord.Client, channelId: string) {
    const channel = await client.channels.fetch(channelId)
    if (!channel || channel.type != ChannelType.GuildText) {
        console.error("Invalid channel id")
        return
    }

    const embed = new Discord.EmbedBuilder()
        .setTitle("Joint a fanclub by clicking the icons below!")
        .addFields([
            {name: "Get a notification for Discord Server Events!", value: `:bell: <@&805766527889440778>`},

            {
                name: "Join one of the San Vallejo Fraternities!", value: `<:rr_apes:920490707721023558> <@&818365011554336809>
<:rr_wolves:920490706768887840> <@&818365035259887626>`
            },

            {
                name: "Choose a girl's fanclub to show your affection!", value: `<:rr_amber:920384376406159390> <@&920365569432244264>
<:rr_aubrey:920384376217427979> <@&920365674591813693>
<:rr_autumn:920384378176172052> <@&920365776500822027>
<:rr_candy:920384378687881256> <@&920365867232014347>
<:rr_chloe:920385301363425350> <@&920365910387228793>
<:rr_emily:920384379426070538> <@&920365961507377162>
<:rr_evelyn:920385301627682856> <@&920366002200514621>
<:rr_jenny:920384378998251570> <@&920366043044671539>
<:rr_lauren:920384378884997160> <@&920366084232728706>
<:rr_lindsey:920384378490720317> <@&920366242773229598>
<:rr_lorraine:920384378763362314> <@&920366319436722206>
<:rr_naomi:920385301917106186> <@&920366504279670865>
<:rr_nora:920384378876600382> <@&920366553252380693>
<:rr_penelope:920384379040198757> <@&920366589239509002>
<:rr_riley:920384378998231081> <@&920366629462876252>
<:rr_samantha:920384378704637973> <@&920366671733092412>
<:rr_satin:920385303288619008> <@&920366732491776121>`
            },
        ])

        .setThumbnail("https://images-ext-2.discordapp.net/external/QOCCliX2PNqo717REOwxtbvIrxVV2DZ1CRc8Svz3vUs/https/collegekingsgame.com/wp-content/uploads/2020/08/college-kings-wide-white.png?width=1440&height=566")

    channel.messages.fetch("805767878212452372").then((message) => {
        message.edit({embeds: [embed]})
    })
}
