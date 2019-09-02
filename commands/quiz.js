const { Command } = require('bot-framework')
const playlist = require('../playlist')
const Game = require('../Game')
const f = require('string-format')

module.exports = class extends Command {
  constructor() {
    const opts = {
      args: ['<start <YouTube Playlist>>', '<stop|end>'],
    }
    super('quiz', opts)
  }

  async run(msg, lang, args) {
    const { games, client } = require('../index')
    if (args[1] === 'start') {
      let game = games.get(msg.guild.id)
      if (!game) {
        if (!msg.member.voiceChannel) return msg.channel.send(lang['join_vc'])
        game = new Game(client)
        games.set(msg.guild.id, game)
      } else if (game.status) return
      if (!msg.member.voiceChannel) return msg.channel.send(lang['join_vc'])
      msg.channel.send(lang.loading)
      const list = await playlist(args[2])
      if (!Array.isArray(list)) return msg.channel.send(list)
      game.init(msg.channel, msg.member.voiceChannel)
      const songs = list.map(video => ({
        id: video.resourceId.videoId,
        title: video.title,
      }))
      game.start(songs)
    } else if (args[1] === 'end' || args[1] === 'stop') {
      const game = games.get(msg.guild.id)
      if (!game || !game.status)
        return msg.channel.send(lang.not_started)
      game.gameend()
      games.delete(msg.guild.id)
      msg.channel.send(f(lang.stopped, msg.author.tag))
    } else msg.channel.send(lang.wrong_args)
  }
}
