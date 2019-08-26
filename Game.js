const _ = require(`./messages`)
const ytdl = require(`ytdl-core`)
const {songReplace} = require(`./song_replace`)
const {LoggerFactory} = require(`logger.js`)
const logger = LoggerFactory.getLogger(`main`, `blue`)

/**
 * Represents a game
 */
class Game {
  /**
   * @param {Client} client Discord.js client
   */
  constructor(client) {
    /**
     * Discord.js client
     * @type {?Client}
     */
    this.client = client

    /**
     * Whether or not joined vc successfully
     * @type {?boolean}
     */
    this.status

    /**
     * Whether or not someone answered correctly
     * @type {?boolean}
     */
    this.correct

    /**
     * The id of timer for open the space between quizzes
     * @type {?number}
     */
    this.timeout

    /**
     * The current video data
     * @type {?Video}
     */
    this.current

    /**
     * Video data used for quizzes
     * @type {?Video[]}
     */
    this.songs

    /**
     * The quiz times counter
     * @type {?number}
     */
    this.count

    /**
     * The stream dispatcher
     * @type {?StreamDispatcher}
     */
    this.dispatcher

    /**
     * The voice connection
     * @type {?VoiceConnection}
     */
    this.connection

    /**
     * The TextChannel to use for quizzes
     * @type {?TextChannel}
     */
    this.tc

    /**
     * The VoiceChannel to use for quizzes
     * @type {?VoiceChannel}
     */
    this.vc
  }

  /**
   * Init the game
   * @param {TextChannel} tc TextChannel
   * @param {VoiceChannel} vc VoiceChannel
   */
  init(tc, vc) {
    this.tc = tc
    this.vc = vc
  }

  /**
   * Set all class variable to null
   * @private
   */
  deinit() {
    this.status = null
    this.correct = null
    this.timeout = null
    this.current = null
    this.songs = null
    this.count = null
    this.dispatcher = null
    this.connection = null
  }

  /**
   * Connect to the VoiceChannel
   * @returns {Promise<boolean>}
   * @private
   */
  async connect() {
    this.connection = await this.vc.join().catch(error => {
      if (this.vc.full) {
        this.tc.send(_.JOIN_VC.FULL(this.vc.name))
      } else if (!this.vc.joinable) {
        this.tc.send(_.JOIN_VC.NO_PERMISSION(this.vc.name))
      } else {
        this.tc.send(_.JOIN_VC.UNKNOWN_ERROR(this.vc.name))
        logger.error(_.CONSOLE.JOIN_VC_ERROR(error))
      }
    })
    if (this.connection) this.status = true
    return this.status
  }

  /**
   * Initialize a quiz
   * @private
   */
  preQuiz() {
    if (typeof this.count !== `number`) this.count = 0; else this.count++
    this.tc.send(_.QUIZ.NEXTQUIZ(this.count))
    this.correct = false
    this.current = this.songs[Math.floor(Math.random() * this.songs.length)]
    this.current.answers = songReplace(this.current.title).filter(e => e)
    logger.info(this.current)
    if (!this.current.answers.length) this.preQuiz()
    else this.timeout = this.client.setTimeout(() => this.quiz(), 5000)
  }

  /**
   * Quiz
   * @private
   */
  quiz() {
    this.tc.send(_.QUIZ.START)
    const stream = ytdl(this.current.id, {filter: `audioonly`})
    this.dispatcher = this.connection.playStream(stream)
      .on(`end`, () => {
        if (!this.correct)
          this.tc.send(_.QUIZ.UNCORRECT(this.current.title))
        if (this.status) this.preQuiz()
      })
  }

  /**
   * The video data
   * @typedef {Object} Video
   * @property {string} id The id of the video
   * @property {string} title The title of the video
   * @property {string[]} [answers] The quiz answers of the video
   */

  /**
   * Start the quiz
   * @param {Video[]} songs Video data used for quizzes
   */
  async start(songs) {
    this.songs = songs
    const status = await this.connect()
    if (status) this.preQuiz()
  }

  /**
   * Stop quiz
   */
  gameend() {
    this.client.clearTimeout(this.timeout)
    this.status = false
    this.correct = true
    this.dispatcher.end()
    this.connection.disconnect()
    this.deinit()
  }

  /**
   * Check answer
   * @param {string} text Answer to check
   */
  check(text) {
    if (this.current.answers.map(a => a.toLowerCase()).some(answer => text.toLowerCase().includes(answer))) {
      this.correct = true
      this.tc.send(_.QUIZ.CORRECT(this.current.title))
      this.dispatcher.end()
    }
  }
}

module.exports = Game
