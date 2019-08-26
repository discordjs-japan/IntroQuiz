function songReplace(name) {
  return [
    songReplace1(name),
    songReplace2(name),
    songReplace3(name),
  ]
}

function songReplace1(name) {
  let a = name
  let result
  a = a.replace(/ -.*/gm, ``)
  a = a.replace(/ ～.*/gm, ``)
  a = a.replace(/\/.*/, ``)
  if ((/.*?／.*?／.*/gm).test(a)) {
    a = a.replace(/.*?／/, ``)
    a = a.replace(/『.*/, ``)
  }
  a = a.replace(/（.*?(\\.|[^）])）/gm, ``)
  a = a.replace(/\(.*?(\\.|[^)])\)/gm, ``)
  a = a.replace(/[^]*(\\.|[^『])『/gm, ``).replace(/』[^]*/gm, ``)
  a = a.replace(/【.*?】/g, ``)
  a = a.replace(/[^]*(\\.|[^／])／/gm, ``)
  a = a.replace(/[^]*(\\.|[^「])「/gm, ``).replace(/」[^]*/gm, ``)
  a = a.replace(/"/gm, ``)
  a = a.replace(/\[[^]*/gm, ``)
  if ((/.*?-([^-].*?)-.*/gm).test(a)) {
    result = a.replace(/.*?- /, ``).replace(/ -.*/, ``)
    return result
  } else {
    a = a.replace(/.* -/g, ``)
  }
  a = a.replace(/ but .*/g, ``)
  a = a.replace((/.*(\s{0,})/).exec(a)[1], ``)
  a = a.replace((/(\s{0,}).*/).exec(a)[1], ``)
  result = a.replace(/（.*/gm, ``)
  return result
}

function songReplace2(name) {
  let a = name
  let result
  a = a.replace(`「`, ``).replace(/」[^]*/gm, ``)
  if ((/.*?／.*?／.*/gm).test(a)) {
    a = a.replace(/／.*/, ``)
    a = a.replace(/』.*/, ``)
    a = a.replace(/.*『/, ``)
  }
  if ((/.*『.*』.*-.*／.*/gm).test(a)) {
    a = a.replace(/／.*/g, ``).replace(/ -.*/, ``).replace(/.*』/, ``)
  } else {
    a = a.replace(/[^]*(\\.|[^『])『/gm, ``).replace(/』[^]*/gm, ``)
  }
  a = a.replace(/.*\//, ``)
  a = a.replace(/（.*?(\\.|[^）])）/gm, ``)
  a = a.replace(/\(.*?(\\.|[^)])\)/gm, ``)
  a = a.replace(/【.*?(\\.|[^】])】/gm, ``)
  a = a.replace(/.*:: /gm, ``)
  a = a.replace(/[^]*(\\.|[^／])／/gm, ``)
  a = a.replace(/[^]*(\\.|[^「])「/gm, ``).replace(/」[^]*/gm, ``)
  a = a.replace(/"/gm, ``)
  a = a.replace(/\[[^]*/gm, ``)
  if ((/.*?-([^-].*?)-.*/gm).test(a)) {
    result = a.replace(/ -.*/, ``)
    return result
  } else {
    a = a.replace(/.* -/g, ``)
  }
  a = a.replace(`-`, ``)
  a = a.replace(/ & .*/gm, ``)
  a = a.replace(/[^a-zA-Z0-9!?あ-んＡ-Ｚａ-ｚ一-青\sーア-ンｱ-ﾝ]*/gm, ``)
  if ((/\s.*/).test(a)) {
    a = a.replace(/\s/, ``)
  } else if ((/　.*/).test(a)) {
    a = a.replace(/　/, ``)
  }
  a = a.replace(/（.*/g, ``)
  if (a !== `Intro`) {
    a = a.replace(`Intro`, ``)
  }
  a = a.replace(/\s*(b|B)y.*/g, ``)
  a = a.replace(/ but .*/g, ``)
  a = a.replace((/.*(\s{0,})/).exec(a)[1], ``)
  a = a.replace((/(\s{0,}).*/).exec(a)[1], ``)
  result = a
  return result
}

function songReplace3(name) {
  const songname = name
  let a = songname
  let result
  if ((/(\(|)feat. .*/g).test(a)) {
    a = (/(.*) (\(|)feat. /g).exec(a)[1]
    a = a.replace(/「.*」/, ``)
    return a
  }
  a = a.replace(`「`, ``).replace(/」[^]*/gm, ``)
  if ((/.*『.*』.*-.*／.*/gm).test(a)) {
    a = a.replace(/／.*/g, ``).replace(/[^]*(\\.|[^- ])*- /gm, ``)
  } else {
    a = a.replace(/[^]*(\\.|[^『])『/gm, ``).replace(/』[^]*/gm, ``)
  }
  a = a.replace(/【.*?】/g, ``)
  a = a.replace(/[^]*(\\.|[^／])／/gm, ``)
  a = a.replace(/[^]*(\\.|[^「])「/gm, ``).replace(/」[^]*/gm, ``)
  a = a.replace(/".*?"/gm, ``)
  a = a.replace(/\[[^]*/gm, ``)
  if ((/.*?-([^-].*?)-.*/gm).test(a)) {
    result = a.replace(/.*- /, ``)
    return result
  } else {
    a = a.replace(/.* -/g, ``)
  }
  a = a.replace(/.* & /gm, ``)
  a = a.replace(/-.*/, ``)
  a = a.replace(/　/gm, ``)
  a = a.replace(/([!]*)/gm, ``)
  a = a.replace(/[^a-zA-Z0-9\s]*/gm, ``)
  a = a.replace(/ feat.*/gm, ``)
  if (a !== `Extended`) {
    a = a.replace(`Extended`, ``)
  }
  a = a.replace(/ but .*/g, ``)
  a = a.replace((/.*(\s{0,})/).exec(a)[1], ``)
  a = a.replace((/(\s{0,}).*/).exec(a)[1], ``)
  result = a.replace(/（.*/gm, ``)
  return result
}

module.exports = {
  songReplace,
  songReplace1,
  songReplace2,
  songReplace3,
}
