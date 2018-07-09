module.exports = {
  "console": {
    "login_complete": (user) => `${user}としてログインしました。`,
    "join_vc_error": (err) => `ボイスチャンネルに接続中に不明なエラーが発生しました: ${err}`
  },
  "help": {
    "commands": `コマンド一覧`
  },
  "join_vc": {
    "success": (vc) => `ボイスチャンネル「${vc}」に参加しました。`,
    "tryagain": `ボイスチャンネルに参加してからもう一度お試しください。`,
    "full": (vc) => `ボイスチャンネル「${vc}」 は満員のため、参加することができませんでした。`,
    "no_permission": (vc) => `ボイスチャンネル「${vc}」 に参加する権限が与えられていないため、参加することができませんでした。`,
    "unknown_error": (vc) => `エラーが発生したため、ボイスチャンネル「${vc}」 に参加することができませんでした。このエラーは自動的に開発者へ送信されます(個人情報は一切収集されません)。`
  },
  "quiz": {
    "please_playlist": `第2引数に再生リストを入力してください。`,
    "invalid_playlist": `再生リストが正しくありません`,
    "loading": `再生リストを読み込み中...`,
    "nextquiz": (times) => `${times}問目！5秒後に始まるよ！`,
    "start": `スタート！この曲は何でしょう？音楽の再生が終了するまで誰も答えられなかった場合は、誰にもポイントは入りません。`,
    "stop": `イントロクイズを終了しました。`,
    "not_started": `イントロクイズはすでに終了しているか、まだ開始していません。`,
    "correct": (title, id) => `正解！答えは「${title}」でした！\nYouTube: https://youtu.be/${id}`,
    "uncorrect": (title, id) => `音楽の再生が終了しました！答えは「${title}」でした！残念...\nYouTube: https://youtu.be/${id}`,
    "error": {
      "unavailable": `:x: この再生リストは**非公開**です。`,
      "notfound": `:x: この再生リストは存在しません(IDを確認してください)。`,
      "badrequest": `:x: Bad Request: YouTube Data APIキーが間違っている可能性があります。`,
      "unknown_error": (err) => `再生リストを読み込み中にエラーが発生しました: ${err}`
    }
  },
  "no_command": `:x: 指定されたコマンドはありません。`,
  "pong": (ping) => `ポン！ Ping の確認に成功しました！ボットの Ping は ${ping}ms です！`,
  "wrong_args": `:x: 引数が足りないか、間違っています。`,
  "exit_vc": (vc) => `ボイスチャンネル「${vc}」を退出しました。`,
  "exit_vc_notjoined": `:x: ボイスチャンネルに参加していません。`,
  "didyoumean": (cmds) => `これはもしかして？ \n${cmds}`
};
