const _ = require(`./messages`)
const ytdl = require(`ytdl-core`)
const {songReplace} = require(`./song_replace`)

class Game {
  constructor(client, tc, vc) {
    this.client = client
    this.tc = tc
    this.vc = vc

    this.status = false // 参加したらtrue
    this.correct = false // 正解がでたらtrue
    this.timeout
    this.current // 現在の動画
    this.songs // 再生リスト
    this.count = 0

    // TODO
    this.dispatcher
    this.connection
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
    this.tc.send(_.QUIZ.NEXTQUIZ(++this.count))
    this.correct = false
    this.timeout = this.client.setTimeout(() => this.quiz(), 5000)
  }

  quiz() {
    this.tc.send(_.QUIZ.START)
    this.current = this.songs[Math.floor(Math.random() * this.songs.length)]
    console.log(this.current)
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
    this.current = []
    this.count = 0
    this.dispatcher.end()
    this.connection.disconnect()
  }

  answer(text) {
    const answers = songReplace(this.current.title).filter(e => e)
    if (answers.some(answer => text.includes(answer))) {
      this.correct = true
      this.tc.send(_.QUIZ.CORRECT(this.current))
      this.dispatcher.end()
    }
  }
}

module.exports = Game
