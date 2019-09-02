const { Command } = require('bot-framework')
const { songReplace } = require('../song_replace')
const Discord = require('discord.js')

module.exports = class extends Command {
  constructor() {
    const opts = {
      args: ['Test string'],
    }
    super('test', opts)
  }

  async run(msg, lang, args, sendDeletable) {
    const { env } = require('../index')
    const text = msg.content.replace(env.PREFIX + 'test ', '')
    const answers = songReplace(text)
    const embed = new Discord.RichEmbed()
      .setTitle('判定テスト')
      .addField('1つ目の答え', `'${answers[1]}'`)
      .addField('2つ目の答え', `'${answers[2]}'`)
      .addField('3つ目の答え', `'${answers[3]}'`)
      .setFooter(`元テキスト: '${text}'`)
    sendDeletable(embed)
  }
}
