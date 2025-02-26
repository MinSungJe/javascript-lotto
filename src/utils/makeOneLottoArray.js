function makeOneLottoArray() {
  const lotto = [];
  while (lotto.length < 6) {
    const curNumber = getRandomInt(44) + 1;
    if (lotto.includes(curNumber)) continue;
    lotto.push(curNumber);
  }

  return lotto.sort((a, b) => a - b);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export default makeOneLottoArray;
