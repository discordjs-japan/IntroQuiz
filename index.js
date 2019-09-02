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
delete require.cache[require.resolve('./messages')]

const {parsed: env} = require('dotenv-safe').config()
const discord = require('discord.js')
const client = new discord.Client()
const games = new Map()
const {LoggerFactory} = require('logger.js')
const logger = LoggerFactory.getLogger('main', 'purple')
const dispatcher = require('bot-framework/dispatcher')
const emojis = require('emojilib/emojis')

client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag}`)
})

client.on('message', async msg => {
  if (!msg.guild) return
  if (msg.author.bot || msg.system) return
  const lang = require('./messages.json')
  if (msg.content.startsWith(env.PREFIX)) {
    logger.info(`${msg.author.tag}がコマンドを送信しました: ${msg.content}`)
    await dispatcher(msg, lang, env.PREFIX, env.OWNERS.split(','), env.PREFIX).catch(e => {
      logger.error(e.stack || e)
      msg.react(emojis['x']['char'])
    })
  }
  /*
  if (msg.content.startsWith(env.PREFIX)) {
    const split = msg.content.replace(env.PREFIX, '').split(/\s{1,}/)
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
        .map(e => `・\'${env.PREFIX}${e.command}\'`)
        .join('\n')
      msg.channel.send(_.NO_COMMAND)
      if (similarCmds) msg.channel.send(_.DIDYOUMEAN(similarCmds))
    }
  }
  */
  if (games.has(msg.guild.id)) {
    const game = games.get(msg.guild.id)
    if (game.tc.id !== msg.channel.id) return
    if (!game.status || game.correct) return
    game.check(msg.content)
  }
})

client.login(env.TOKEN)

process.on('unhandledRejection', e => logger.error(e.stack))

module.exports = { client, games, env }
