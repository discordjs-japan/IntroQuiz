const discord = require(`discord.js`),
  client = new discord.Client(),
  prefix = `q.`, //Bot prefix
  token = ``, //Your bot token
  ytdl = require(`ytdl-core`),
  songs = [
    //[`動画ID`, `曲名`]
    [`Nvc0hgt9I1g`, `Vexento Masked Raver`],
    [`3lEqdKfvrQg`, `Towbige K Person`],
    [`pVLmZMjxfjw`, `Eiffel 65 Blue (KNY Factory Remix)`],
    [`ntLop32pYd0`, `Diplo Revolution (Sean Bobo Remix)`],
    [`s8XIgR5OGJc`, `The Chainsmokers Don't Let Me Down (Illenium Remix)`],
    [`WIXjHt8KmUc`, `Zara Larsson Never Forget You (Price Takis Remix)`],
    [`slxaN92y7hk`, `Bryan Mason Karner H Bassjump`],
    [`LrTYqFW62ek`, `Astrid S Breathe (Ava Remix)`],
    [`ih2xubMaZWI`, `OMFG Hello`],
    [`qn-X5A0gbMA`, `OMFG I Love You`],
    [`36SVBZhC6iA`, `Cosmic Out Of Control`],
    [`HtkImmE7VfA`, `Stefan Nixdorf Commodus Pt.2`],
    [`JahJfGvn_zQ`, `Cupidz Sheet`],
    [`wJnBTPUQS5A`, `Alan Walker The Spectre`],
    [`Dmc3sQPWl-M`, `Alan Walker All Falls Down (Steve Aoki Remix)`],
    [`tHSzm0omzTs`, `Dirty Rush Gregor Es Brass 2.0`],
    [`u86pVtqn_kk`, `Dirty Rush Gregor Es Brass`],
    [`su0FCBRwVpE`, `Yunomi nicamoq インドア系ならトラックメイカー`],
    [`XWR3QirN2e4`, `Alex Skrindo Lights`],
    [`Q2LUTO_witY`, `Konac Home`],
    [`WmC-Cp2ZE70`, `Urbanstep Icebreaker`],
    [`rL-GigGJJJQ`, `Vonikk Phoenix`],
    [`OnVNcl7mX_Q`, `Vonikk Nova`],
    [`tIoE4MP4m8k`, `K-391 Don't Stop`],
    [`QWdlzq5155E`, `K-391 Summertime`],
    [`G9cl-79x-UQ`, `Panda Eyes On My Own`],
    [`ECLxDMZrGQI`, `Liu Groove`],
    [`3xpOfuqAML0`, `Morgan Page Safe Till Tomorrow (Brooks Remix)`],
    [`Q10rcPzwv8A`, `K-391 Everybody`],
    [`5wpC6RcWsmE`, `Alex Skrindo Waves`],
    [`c5V59qd60-Y`, `Alex Skrindo Jumbo`],
    [`PEXksy5yI7k`, `NeoTune! x TobiMorrow Free WiFi`],
    [`Czn4ePYd5Co`, `Axero Beginning`],
    [`pIkK4uYLP9A`, `Janji Shine`],
    [`gvsarn8ds_4`, `Cullimore ILARI Escape`],
    [`CXHYiYxCDhg`, `Debris Game Over`],
    [`11Dby5Osk5w`, `Ollie Crowe Precious Time`],
    [`kCneqaU1tR0`, `NeoTune! Hermax Buzzard`],
    [`FBZLRJ5S3nE`, `Vexento Glow`],
    [`7ly0FT40Nbk`, `Never Gonna Catch The Thug Theme (Goblin Mashup)`],
    [`vBdnfyfBSKg`, `Black Coast TRNDSTTR (Lucian Remix)`],
    [`k0ISVotJFEI`, `Sean&Bobo 119`],
    [`hUSgiZOx-Ss`, `Dropgun Angst`],
    [`60ItHLz5WEA`, `Alan Walker Faded`],
    [`3ym7j3cNDzE`, `Zomby Girlz The Feelings`],
    [`XEnmxFCcwqM`, `El Speaker Skan Never Gonna Catch Me`],
    [`U3J1TNuhOTU`, `Maone Hold On`],
    [`3nlSDxvt6JU`, `Snail's House Pixel Galaxy (Official MV)`],
    [`HpaHvUOk3F0`, `Different Heaven Far Away`],
    [`kaAm6mNaqk0`, `Michael White All Eyes On Me`],
    [`sA_p0rQtDXE`, `Axol x Alex Skrindo You`],
    [`QMxUCfGiZ9Q`, `Culture Code Regoton Waking Up`],
    [`S81bLqpstUE`, `Lensko Titsepoken 2015`],
    [`bM7SZ5SBzyY`, `Alan Walker Fade`],
    [`A9lImW4wUiU`, `Janji Together`],
    [`l3koI8ft32c`, `Skan El Speaker Never Gonna Catch Me (Dreamer Remix)`],
    [`1-xGerv5FOk`, `Alan Walker Alone`],
    [`ZLohS_HScwc`, `3rd Prototype Dancefloor`],
    [`ZLhfr8mpzxU`, `Vexento Masked Heroes`],
    [`n8X9_MgEdCg`, `TheFatRat Unity`],
    [`r7Ve8ExE8YY`, `Black Coast TRNDSTTR (Lucian Remix)`],
    [`J2X5mJ3HDYE`, `DEAF KEV Invincible`],
    [`7wNb0pHyGuI`, `Tobu Roots`],
    [`FseAiTb8Se0`, `Kovan Electro-Light Skyline`],
    [`maKok2RItxM`, `fhána 青空のラプソディ`],
    [`-tKVN2mAKRI`, `DAOKO 米津玄師 打上花火`],
    [`fwUqWgHMlyo`, `Alan Walker Alex Skrindo Sky`],
    [`d0uFvhCHWCo`, `TheFatRat No No No`],
    [`JGwWNGJdvx8`, `Ed Sheeran Shape of You`],
    [`-EKxzId_Sj4`, `米津玄師 アイネクライネ`],
    [`ULHeRdgeT54`, `San Holo Light`],
    [`uWG1pWSpx_E`, `SunnYz Victory`],
    [`sI7wMs3YYfU`, `Thimlife Marque Aurel Believe`],
    [`MFD0MRJMdRg`, `Vexento Digital Kiss`],
    [`lqYQXIt4SpA`, `Alan Walker Force`],
    [`hsXeFqj5p7Q`, `Defqwop Heart Afire`],
    [`6RLLOEzdxsM`, `Alan Walker All Falls Down`],
    [`JsrpLWqH4_4`, `RetroVision Martin Gutierrez Flash`],
    [`Gc3tqnhmf5U`, `TheFatRat Oblivion`],
    [`ZuurdGpRCuU`, `Techno Tetris (Remix)`],
    [`3wjb3HtD32c`, `Cartoon feat. Jüri Pootsmann I Remember U`],
    [`0T4nSXULU-k`, `Yeah Yeah Yeahs x A-Trak Heads Will Roll (DiscoTech Remix)`],
    [`kKwAgQPa32s`, `Hinkik Outbreaker`],
    [`cGbP2y7Obas`, `Hinkik Ena`],
    [`kF6lrNkC9bo`, `Raven Kreyn Bubble`],
    [`h18gwLKQf_Q`, `Tobu Seven`],
    [`VtKbiyyVZks`, `Itro Tobu Cloud 9`],
    [`4lXBHD5C8do`, `Tobu Itro Sunburst`],
    [`B7xai5u_tnk`, `TheFatRat Monody`],
    [`8h-fqAnIn0A`, `Ampyx Rise`],
    [`ux8-EbW6DUI`, `Tobu Infectious`],
    [`n4tK7LYFxI0`, `Spektrem Shine`],
    [`JSY6vBPunpY`, `Desmeon Hellcat`],
    [`czUB6bVwwDg`, `Debris Dazers Double D`],
    [`AOeY-nDp7hI`, `Alan Walker Spectre`],
    [`jK2aIUmmdP4`, `Different Heaven EH!DE My Heart`],
    [`K4DyBUG242c`, `Cartoon On On`],
    [`zyXmsVwZqX4`, `Cartoon Why We Lose`],
    [`dXYFK-jEr8Y`, `JPB MYRNE Feels Right`],
    [`S6RWY8OYwbk`, `Anikdote Turn It Up`],
    [`C6IaUMAg3Dc`, `Jo Cohen Sex Whales We Are`],
    [`vpvytpRa_tQ`, `Jensation  Joystick`],
    [`QfhF0V9VlJA`, `RetroVision Heroes`],
    [`YHSH9k9ooZY`, `Tobu Good Times`],
    [`6Fg8733eOkg`, `Mountkid No Lullaby`],
    [`MJpacceodFE`, `Enzo Darren NOLA`],
    [`xSUQcQYgQCY`, `Older Grand x KBN NoOne Say Yea`],
    [`sOI32lU8NLY`, `Blackstripe Boobs`],
    [`NtAsJNPKsmU`, `Autoerotique Max Styler Badman (Torro Torro Remix)`],
    [`dov1IAzp5Ro`, `iru1919 天狐`],
    [`aOIOyvQU9Tg`, `7UBO Furia`],
    [`4ipF9Wb8r-Q`, `Ollie Crowe Rich James Voices`],
    [`FJerhImwS5E`, `Alex Skrindo Stahl! Moments`],
    [`Fd9AOs4BMVM`, `Yunomi ダンスフロアの果実`],
    [`B9rPUaRn-rU`, `Culture Code feat. Karra Make Me Move (James Roche Remix)`],
    [`MRwmxS1AL6E`, `Culture Code Make Me Move (Tobu Remix)`],
    [`T4Gq9pkToS8`, `Rob Gasser Ricochet`],
    [`9Va88Kt0NN0`, `Elektronomia JJD Free`],
    [`NfuTWnIXad0`, `Laszlo Here We Are`],
    [`VEpaB3lLdvQ`, `Marcus Mouya Tears Of The Sun`],
    [`zsuFLJ_2FNE`, `Brooks Pinball`],
    [`jfFD22S4TXM`, `Hinkik Skystrike`],
    [`f8lnKRH1DH8`, `Extra Terra Game Over`],
    [`TX6LIVaCkDo`, `K-391 Allstars`],
    [`PXqbyHm6hX8`, `Hoaprox Waiting For You`],
    [`1IRG7IqixwA`, `Nightcore Rumors`],
    [`7-7knsP2n5w`, `Shakira La La La`],
    [`LcmpLp5_Azo`, `Stefan Nixdorf Commodus Pt.1`],
    [`ECO8TgjizsM`, `Sonny Bass Chasner Africa`],
    [`kkFP0hpxZgQ`, `Clarx Uplink Titans`],
    [`SwPnjyjGbFQ`, `John Dish feat. Naika You Me`],
    [`PZDId_rJps0`, `Tobu Nostalgia`],
    [`Wr32m98LbyA`, `IZECOLD Swiggity`],
    [`sftDWoPAoJQ`, `Distrion Alex Skrindo Entropy`],
    [`W9OlYkMpTus`, `Robby East N70`],
    [`4_KIgU0abqA`, `Clarx Maakhus Psychedelic`],
    [`D9BBLQa9B8w`, `Monkey Warriors Everybody`],
    [`8eeI-eoFdUY`, `Husman, Renstone ANG Can't Hold Us`],
    [`4o0ejRL-Iv8`, `F.O.O.L Showdown`],
    [`eoy7Rt3f-1o`, `Alex Skrindo Geoxor KawaiiStep`],
    [`ueSxyMZOch4`, `Maiki Vanics Vice`],
    [`Cm1jassQKrQ`, `Steam Phunk Easy`],
    [`6HkkxtPDlZQ`, `Jacob Tillberg A Dream`],
    [`LtoDjPutaIc`, `Knife Party Power Glove`],
    [`GvEywaJj6t8`, `Aiobahn Yunomi 銀河鉄道のペンギン (Stripe.P Remix)`],
    [`hg3-Rg8U6WE`, `Brooks If Only I Could`],
    [`zYMrMNH_Y3I`, `IZECOLD Close (Brooks Remix)`],
    [`ih2xubMaZWI`, `OMFG Hello`],
    [`_Eh3M5DJUio`, `TheFatRat Time Lapse`],
    [`jHVt4mpOH8A`, `EnV Microburst`],
    [`w-8lw7vDHQU`, `OMFG Ice Cream`],
    [`2sW08zLO8S8`, `EnV Pneumatic Tokyo`],
    [`UWgkBgMfnFA`, `Soundartz Action`],
    [`ynf7CoXssTE`, `Archie Back Again`],
    [`WYLkk1BQnsU`, `Riggi Piros Love Me A Little`],
    [`BwEZaariQQ4`, `NEFFEX Rumors`],
    [`ISqJa5STRGw`, `TobiMorrow Royal Dance`],
    [`FqBef-BEfS8`, `7UBO Cantaffa Next Level`],
    [`RgP_NONLso4`, `Chime Pyrotechnics`]
  ];

let status = false,
  songinfo = ``,
  connection = ``;

client.on(`ready`, () => {
  console.log(`ログインが完了しました。`);
});

client.on(`message`, (msg) => {
  if (!msg.guild) return;
  if (msg.author.bot) return;
  if (msg.content.startsWith(prefix)) {
    const split = msg.content.replace(prefix, ``).split(` `);
    if (split[0] === `ping`) {
      msg.channel.send(`ポン！ Ping の確認に成功しました！ボットの Ping は ${Math.floor(client.ping)}ms です！`);
    } else if (split[0] === `connect`) {
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
    } else if (split[0] === `disconnect`) {
      if (msg.member.voiceChannel) {
        msg.member.voiceChannel.leave();
        msg.channel.send(`ボイスチャンネル「${msg.member.voiceChannel.name}」を退出しました。`);
      } else {
        msg.channel.send(`ボットが退出するボイスチャンネルに参加してからもう一度お試しください。`);
      }
    } else if (split[0] === `quiz`) {
      if (split[1] === `start`) {
        if (msg.member.voiceChannel) {
          msg.member.voiceChannel.join().then((con) => {
            connection = con;
            msg.channel.send(`５秒後にイントロクイズを開始します。`);
            setTimeout(() => {
              status = true;
              nextquiz(msg);
            }, 5000);
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
      if (split[1] === `end`) {
        if (status) {
          status = false;
          msg.channel.send(`イントロクイズを終了しました。`);
        } else {
          msg.channel.send(`既にイントロクイズは終了しています。`);
        }
      }
    }
  } else if (status) {
    if (~songinfo[1].split(` `).indexOf(msg.content))
      msg.channel.send(`正解！答えは「${songinfo[1]}」でした！\nYouTube: https://youtu.be/${songinfo[0]}`);
    connection.disconnect();
    nextquiz(msg);
  }
});

function nextquiz(msg, number = 0) {
  msg.channel.send(`${++number} 問目！五秒後に始まるよ！`);
  setTimeout(() => {
    msg.channel.send(`スタート！この曲は何でしょう？音楽の再生が終了するまで誰も答えられなかった場合は、誰にもポイントは入りません。`);
    songinfo = songs[Math.floor(Math.random() * songs.length)];
    console.log(songinfo);
    const stream = ytdl(songinfo[0], { "filter": `audioonly` }),
      dispatcher = connection.playStream(stream);
    dispatcher.on(`end`, (end) => {
      msg.channel.send(`音楽の再生が終了しました！答えは「${songinfo[1]}」でした！残念...\nYouTube: https://youtu.be/${songinfo[0]}`);
      nextquiz(msg, number);
    });
  });
};

client.login(token);
