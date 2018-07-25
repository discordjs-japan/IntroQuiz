const _ = require(`./messages`)
const ytdl = require(`ytdl-core`)
const {songReplace} = require(`./song_replace`)

class Game {
  constructor(client) {
    this.client = client
  }

  init(tc, vc) {
    this.tc = tc
    this.vc = vc
  }

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

  async connect() {
    this.connection = await this.vc.join().catch(error => {
      if (this.vc.full) {
        this.tc.send(_.JOIN_VC.FULL(this.vc.name))
      } else if (!this.vc.joinable) {
        this.tc.send(_.JOIN_VC.NO_PERMISSION(this.vc.name))
      } else {
        this.tc.send(_.JOIN_VC.UNKNOWN_ERROR(this.vc.name))
        console.error(_.CONSOLE.JOIN_VC_ERROR(error))
      }
    })
    if (this.connection) this.status = true
    return this.status
  }

  preQuiz() {
    if (!this.count) this.count = 0; else ++this.count
    this.tc.send(_.QUIZ.NEXTQUIZ(this.count))
    this.correct = false
    this.current = this.songs[Math.floor(Math.random() * this.songs.length)]
    this.current.answers = songReplace(this.current.title).filter(e => e)
    console.log(this.current)
    if (!this.current.answers.length) return this.preQuiz()
    this.timeout = this.client.setTimeout(() => this.quiz(), 5000)
  }

  quiz() {
    this.tc.send(_.QUIZ.START)
    const stream = ytdl(this.current.id, {filter: `audioonly`})
    this.dispatcher = this.connection.playStream(stream)
      .on(`end`, () => {
        if (!this.correct)
          this.tc.send(_.QUIZ.UNCORRECT(this.current))
        if (this.status) this.preQuiz()
      })
  }

  async start(songs) {
    this.songs = songs
    const status = await this.connect()
    if (!status) return
    this.preQuiz()
  }

  gameend() {
    this.client.clearTimeout(this.timeout)
    this.status = false
    this.correct = true
    this.dispatcher.end()
    this.connection.disconnect()
    this.deinit()
  }

  check(text) {
    if (this.current.answers.some(answer => text.includes(answer))) {
      this.correct = true
      this.tc.send(_.QUIZ.CORRECT(this.current))
      this.dispatcher.end()
    }
  }
}

module.exports = Game
