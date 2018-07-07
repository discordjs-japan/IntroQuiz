const ypi = require(`youtube-playlist-info`);

module.exports = async (messages, text) => {
  if (!text) return messages.quiz.please_playlistid;
  if (text.length < 34) return `:x: 文字数が足りません(34文字以上であることが必須です)。`;
  if (text.length > 34) text = (text.match(/[&?]list=([^&]+)/i) || [])[1];
  if (!text) return `再生リストが正しくありません`;
  return await ypi(process.env.APIKEY, text)
    .catch((error) => {
      if (error === `Error: The request is not properly authorized to retrieve the specified playlist.`) {
        return `:x: このプレイリストは非公開です。`;
      } else if (error === `Error: The playlist identified with the requests <code>playlistId</code> parameter cannot be found.`) {
        return `:x: このプレイリストは存在しません。`;
      } else if (error === `Error: Bad Request`) {
        return `:x: Bad Request: YouTube Data APIキーが間違っている可能性があります。`;
      } else {
        return `再生リスト読み込みエラー：\`${error}\``;
      }
    });
};
