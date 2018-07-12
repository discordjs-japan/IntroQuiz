module.exports = {
  CONSOLE: {
    LOGIN_COMPLETE: user => `${user}としてログインしました。`,
    JOIN_VC_ERROR: err => `ボイスチャンネルに接続中に不明なエラーが発生しました: ${err}`,
  },
  HELP: {
    COMMANDS: `コマンド一覧`,
  },
  JOIN_VC: {
    SUCCESS: vc => `ボイスチャンネル「${vc}」に参加しました。`,
    TRYAGAIN: `ボイスチャンネルに参加してからもう一度お試しください。`,
    FULL: vc => `ボイスチャンネル「${vc}」 は満員のため、参加することができませんでした。`,
    NO_PERMISSION: vc => `ボイスチャンネル「${vc}」 に参加する権限が与えられていないため、参加することができませんでした。`,
    UNKNOWN_ERROR: vc => `エラーが発生したため、ボイスチャンネル「${vc}」 に参加することができませんでした。このエラーは自動的に開発者へ送信されます(個人情報は一切収集されません)。`,
  },
  QUIZ: {
    PLEASE_PLAYLIST: `第2引数に再生リストを入力してください。`,
    INVALID_PLAYLIST: `再生リストが正しくありません`,
    LOADING: `再生リストを読み込み中...`,
    NEXTQUIZ: times => `${times}問目！5秒後に始まるよ！`,
    START: `スタート！この曲は何でしょう？音楽の再生が終了するまで誰も答えられなかった場合は、誰にもポイントは入りません。`,
    STOP: `イントロクイズを終了しました。`,
    NOT_STARTED: `イントロクイズはすでに終了しているか、まだ開始していません。`,
    CORRECT: (id, title) => `正解！答えは「${title}」でした！\nYouTube: https://youtu.be/${id}`,
    UNCORRECT: (id, title) => `音楽の再生が終了しました！答えは「${title}」でした！残念...\nYouTube: https://youtu.be/${id}`,
    ERROR: {
      UNAVAILABLE: `:x: この再生リストは**非公開**です。`,
      NOTFOUND: `:x: この再生リストは存在しません(IDを確認してください)。`,
      BADREQUEST: `:x: Bad Request: YouTube Data APIキーが間違っている可能性があります。`,
      UNKNOWN_ERROR: err => `再生リストを読み込み中にエラーが発生しました: ${err}`,
    },
  },
  NO_COMMAND: `:x: 指定されたコマンドはありません。`,
  PONG: ping => `ポン！ Ping の確認に成功しました！ボットの Ping は ${ping}ms です！`,
  WRONG_ARGS: `:x: 引数が足りないか、間違っています。`,
  EXIT_VC: vc => `ボイスチャンネル「${vc}」を退出しました。`,
  EXIT_VC_NOTJOINED: `:x: ボイスチャンネルに参加していません。`,
  DIDYOUMEAN: cmds => `これはもしかして？ \n${cmds}`,
}
