// |---------------------------------------------|
// |  ____      _ ____            _ ____  _   _  |
// | |  _ \    | / ___|          | |  _ \| \ | | |
// | | | | |_  | \___ \ _____ _  | | |_) |  \| | |
// | | |_| | |_| |___) |_____| |_| |  __/| |\  | |
// | |____/ \___/|____/       \___/|_|   |_| \_| |
// |                                             |
// |---------------------------------------------|
//
// GitHub Repository: https://github.com/DJS-JPN/IntroQuiz
//
// GitLab Repository: https://gitlab.com/DJS-JPN/IntroQuiz
//

/* Clear cache */
delete require.cache[require.resolve(`./messages`)]

const {parsed: env} = require(`dotenv-safe`).config()
const discord = require(`discord.js`)
const client = new discord.Client()
const playlist = require(`./playlist`)
const {songReplace} = require(`./song_replace`)
const levenshtein = require(`fast-levenshtein`)
const _ = require(`./messages`)
const commands = {}
const Game = require(`./Game`)
const games = new Map()
const {LoggerFactory} = require(`logger.js`)
const logger = LoggerFactory.getLogger(`main`, `purple`)

client.on(`ready`, () => {
  logger.info(_.CONSOLE.LOGIN_COMPLETE(client.user.tag))
})

client.on(`message`, async msg => {
  if (!msg.guild) return
  if (msg.author.bot || msg.system) return
  if (msg.content.startsWith(env.PREFIX)) {
    logger.info(`${msg.author.tag}がコマンドを送信しました: ${msg.content}`)
    const split = msg.content.replace(env.PREFIX, ``).split(` `)
    const command = split[0]
    if (commands[command]) commands[command].run(msg, split)
    else {
      const cmds = Object.keys(commands)
      const commandList = cmds.map(cmd => ({
        command: cmd,
        levenshtein: levenshtein.get(split[0], cmd),
      }))
      const similarCmds = commandList.filter(e => e.levenshtein <= 2)
        .sort((a, b) => a.no - b.no)
        .map(e => `・\`${env.PREFIX}${e.command}\``)
        .join(`\n`)
      msg.channel.send(_.NO_COMMAND)
      if (similarCmds) msg.channel.send(_.DIDYOUMEAN(similarCmds))
    }
  } else if (games.has(msg.guild.id)) {
    const game = games.get(msg.guild.id)
    if (game.tc.id !== msg.channel.id) return
    if (!game.status || game.correct) return
    game.check(msg.content)
  }
})

commands.ping = {
  description: `ボットのPingを確認`,
  usage: [[`ping`, `ボットのPingを確認`]],
  run(msg) {
    msg.channel.send(_.PONG(Math.floor(client.ping)))
  },
}

commands.help = {
  description: `ヘルプを表示`,
  usage: [[`help [<command>]`, `ヘルプを表示`]],
  run(msg, split) {
    if (split[1]) {
      const cmd = commands[split[1]]
      if (!cmd || !cmd.description && !cmd.usage)
        return msg.channel.send(_.NO_COMMAND)
      const embed = new discord.RichEmbed()
        .setTitle(split[1])
        .setTimestamp()
      if (cmd.description) embed.setDescription(cmd.description)
      if (cmd.usage) cmd.usage.forEach(usage => embed.addField(...usage))
      msg.channel.send(embed)
    } else {
      const embed = new discord.RichEmbed()
        .setTitle(_.HELP.COMMANDS)
        .setTimestamp()
      Object.keys(commands).forEach(cmd => {
        const command = commands[cmd]
        if (command.description)
          embed.addField(cmd, command.description)
      })
      msg.channel.send(embed)
    }
  },
}

commands.quiz = {
  description: `イントロクイズを開始、終了`,
  usage: [
    [`quiz start <YouTubeプレイリスト>`, `イントロクイズを開始`],
    [`quiz (end|stop)`, `イントロクイズを終了`],
  ],
  async run(msg, split) {
    if (split[1] === `start`) {
      let game = games.get(msg.guild.id)
      if (!game) {
        if (!msg.member.voiceChannel)
          return msg.channel.send(_.JOIN_VC.TRYAGAIN)
        game = new Game(client)
        games.set(msg.guild.id, game)
      } else if (game.status) return
      if (!msg.member.voiceChannel) return msg.channel.send(_.JOIN_VC.TRYAGAIN)
      msg.channel.send(_.QUIZ.LOADING)
      const list = await playlist(split[2])
      if (!Array.isArray(list)) return msg.channel.send(list)
      game.init(msg.channel, msg.member.voiceChannel)
      const songs = list.map(video => ({
        id: video.resourceId.videoId,
        title: video.title,
      }))
      game.start(songs)
    } else if (split[1] === `end` || split[1] === `stop`) {
      const game = games.get(msg.guild.id)
      if (!game || !game.status)
        return msg.channel.send(_.QUIZ.NOT_STARTED)
      game.gameend()
      games.delete(msg.guild.id)
      msg.channel.send(_.QUIZ.STOP)
    } else msg.channel.send(_.WRONG_ARGS)
  },
}

commands.test = {
  run(msg) {
    const text = msg.content.replace(env.PREFIX + `test `, ``)
    const answers = songReplace(text)
    const embed = new discord.RichEmbed()
      .setTitle(`判定テスト`)
      .addField(`1つ目の答え`, `\`${answers[1]}\``)
      .addField(`2つ目の答え`, `\`${answers[2]}\``)
      .addField(`3つ目の答え`, `\`${answers[3]}\``)
      .setFooter(`元テキスト: \`${text}\``)
    msg.channel.send(embed)
  },
}

client.login(env.TOKEN)

process.on(`unhandledRejection`, e => logger.error(e))
