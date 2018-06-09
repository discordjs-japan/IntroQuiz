const {"parsed": env} = require(`dotenv-safe`).config(),
  discord = require(`discord.js`),
  client = new discord.Client(),
  ytdl = require(`ytdl-core`),
  ypi = require(`youtube-playlist-info`);

let status = false,
  correct = false,
  songinfo = ``,
  connection = ``,
  dispatcher,
  songs;

var timeout = null;

client.on(`ready`, () => {
  console.log(`ログインが完了しました。`);
});

client.on(`message`, async (msg) => {
  if (!msg.guild) return;
  if (msg.author.bot || msg.system) return;
  if (msg.content.startsWith(env.PREFIX)) {
    const split = msg.content.replace(env.PREFIX, ``).split(` `),
      command = split[0];
    if (typeof global[command] === `function`) {
      if (command === `nextquiz`) return;
      global[command](msg, split);
    } else {
      msg.channel.send(":x: そのようなコマンドはありません。");
    }
  } else if (status) {
    let a = song_replace(songinfo[1]);
    // if (~songinfo[1].split(/\s+/).indexOf(msg.content)) {
    if (~songinfo[1].indexOf(a)) {
      correct = true;
      msg.channel.send(`正解！答えは「${songinfo[1]}」でした！\nYouTube: https://youtu.be/${songinfo[0]}`);
      dispatcher.end();
    }
  }
});
global.ping = (msg, split) => {
  msg.channel.send(`ポン！ Ping の確認に成功しました！ボットの Ping は ${Math.floor(client.ping)}ms です！`);
};

global.connect = (msg, split) => {
  if (msg.member.voiceChannel) {
    msg.member.voiceChannel.join().then((connection) =>
      msg.channel.send(`ボイスチャンネル「${msg.member.voiceChannel.name}」の参加に成功しました。`)
    ).catch((error) => {
      if (msg.member.voiceChannel.full) {
        msg.channel.send(`ボイスチャンネル「${msg.member.voiceChannel.name} は満員のため、参加することができませんでした。`);
      } else if (!msg.member.voiceChannel.joinable) {
        msg.channel.send(`ボイスチャンネル「${msg.member.voiceChannel.name} に参加する権限が与えられていないため、参加することができませんでした。`);
      } else {
        msg.channel.send(`予期せぬエラーが発生したため、ボイスチャンネル「${msg.member.voiceChannel.name} に参加することができませんでした。このエラーは自動的に開発者へと送信されます（個人情報は一切収集されません）`);
        console.error(`ボットの参加時にエラーが発生しました：${error}`);
      }
    });
  } else {
    msg.channel.send(`ボットが参加するボイスチャンネルに参加してからもう一度お試しください。`);
  }
};

global.disconnect = (msg, split) => {
  if (msg.member.voiceChannelID === msg.guild.me.voiceChannelID) {
    msg.member.voiceChannel.leave();
    msg.channel.send(`ボイスチャンネル「${msg.member.voiceChannel.name}」を退出しました。`);
  } else {
    msg.channel.send(`ボットが退出するボイスチャンネルに参加してからもう一度お試しください。`);
  }
};

global.quiz = async (msg, split) => {
  if (split[1] === `start`) {
    if (status) return;
    if (msg.member.voiceChannel) {
      if (!split[2]) return msg.channel.send(`再生リストIDを入力してください`);
      msg.channel.send(`再生リスト読み込み中...`);
      if(split[2].length < 34) { return msg.channel.send(":x: 文字数が足りません(34文字以上であることが必須です)。"); }
      split[2] = split[2].replace("https://www.youtube.com/playlist?list=", "");
      if (~split[2].indexOf("https://www.youtube.com/watch?v=") && ~split[2].indexOf("&list=")) {
        split[2] = split[2].replace("&list=", "");
        split[2] = split[2].replace("https://www.youtube.com/watch?v=", "").slice(11);
        split[2] = split[2].replace(/&index=(\\.|[^&])*/gm, "");
      }
      const list = await ypi(env.APIKEY, split[2]).
        catch((error) => {
	  if (error == "Error: The request is not properly authorized to retrieve the specified playlist.") {
	    return msg.channel.send(":x: このプレイリストは非公開です。");
	  } else if (error == "Error: The playlist identified with the requests <code>playlistId</code> parameter cannot be found.") {
	    return msg.channel.send(":x: このプレイリストは存在しません。");
	  } else if (error == "Error: Bad Request") {
	    return msg.channel.send(":x: Bad Request: YouTube Data APIキーが間違っている可能性があります。");
	  } else {
	    return msg.channel.send(`再生リスト読み込みエラー：\`${error}\``);
	  }
	});
      songs = list.map((video) => [video.resourceId.videoId, video.title]);
      msg.member.voiceChannel.join().then((con) => {
        connection = con;
        status = true;
        nextquiz(msg);
      }).catch((error) => {
        if (msg.member.voiceChannel.full) {
          msg.channel.send(`ボイスチャンネル「${msg.member.voiceChannel.name} は満員のため、参加することができませんでした。`);
        } else if (!msg.member.voiceChannel.joinable) {
          msg.channel.send(`ボイスチャンネル「${msg.member.voiceChannel.name} に参加する権限が与えられていないため、参加することができませんでした。`);
        } else {
          msg.channel.send(`予期せぬエラーが発生したため、ボイスチャンネル「${msg.member.voiceChannel.name} に参加することができませんでした。このエラーは自動的に開発者へと送信されます（個人情報は一切収集されません）`);
          console.error(`ボットの参加時にエラーが発生しました：${error}`);
        }
      });
    } else {
      msg.channel.send(`ボットが参加するボイスチャンネルに参加してからもう一度お試しください。`);
    }
  }
  if (split[1] === `end` || split[1] === `stop`) {
    if (status) {
      client.clearTimeout(timeout);
      status = false;
      correct = false;
      dispatcher.end();
      connection.disconnect();
      msg.channel.send(`イントロクイズを終了しました。`);
    } else {
      msg.channel.send(`イントロクイズが既に終了されているか、まだ開始されていません。`);
    }
  }
};

function nextquiz(msg, number = 0) {
  msg.channel.send(`${++number} 問目！五秒後に始まるよ！`);
  correct = false;
  timeout = client.setTimeout(() => {
    msg.channel.send(`スタート！この曲は何でしょう？音楽の再生が終了するまで誰も答えられなかった場合は、誰にもポイントは入りません。`);
    songinfo = songs[Math.floor(Math.random() * songs.length)];
    console.log(songinfo);
    const stream = ytdl(songinfo[0], {"filter": `audioonly`});
    dispatcher = connection.playStream(stream);
    dispatcher.on(`end`, (end) => {
      if (!correct)
        msg.channel.send(`音楽の再生が終了しました！答えは「${songinfo[1]}」でした！残念...\nYouTube: https://youtu.be/${songinfo[0]}`);
      if (status) nextquiz(msg, number);
    });
  }, 5000);
}

global.test = (msg, split) => {
  msg.channel.send("Extracted name: `" + song_replace(msg.content) + "`");
};

function song_replace(name) {
    let songname = name;
    let a = songname.replace(env.PREFIX + "test ", "");
    a = a.replace("「", "").replace(/」[^]*/gm, "");
    a = a.replace(/[^]*(\\.|[^『])『/gm, "").replace(/』[^]*/gm, "");
    a = a.replace(/[^]*(\\.|[^- ])*- /gm, "");
    a = a.replace(/[^]*(\\.|[^／])／/gm, "");
    a = a.replace(/[^]*(\\.|[^「])「/gm, "").replace(/」[^]*/gm, "");
    a = a.replace(/\(.*/gm, "");
    a = a.replace(/"/, "").replace(/"/, "");
    a = a.replace(/-[^]*/gm, "");
    let result = a.replace(/（.*/gm, "");
    return result;
}

client.login(env.TOKEN);
