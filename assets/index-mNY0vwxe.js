var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _LottoGame_instances, resetResult_fn;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const Constants = Object.freeze({
  LOTTO: {
    UNIT: 1e3,
    NUMBER_LENGTH: 6,
    MAX_NUMBER: 45,
    MIN_NUMBER: 1,
    MAX_PRICE: 1e5,
    CORRECT_NUMBER: {
      FIRST: 6,
      SECOND: 5,
      THIRD: 5,
      FOURTH: 4,
      FIFTH: 3
    },
    PRIZE: {
      FIFTH: 5e3,
      FOURTH: 5e4,
      THIRD: 15e5,
      SECOND: 3e7,
      FIRST: 2e9
    }
  },
  OPERATOR: {
    SEPARATOR: ","
  },
  MESSAGE: {
    PRICE: "> 구입금액을 입력해 주세요.",
    TARGET_NUMBER: "> 당첨 번호를 입력해 주세요.",
    BONUS_NUMBER: "> 보너스 번호를 입력해 주세요.",
    RESTART_STRING: "> 다시 시작하시겠습니까? (y/n) ",
    NO_LOTTO: "아직 로또를 구매하지 않았습니다!"
  },
  ERROR: {
    NO_LOTTO: "[ERROR] 로또를 구매하지 않으셨습니다!",
    PRICE_TYPE: "[ERROR] 금액을 1,000원 단위의 숫자로 입력해주세요!",
    PRICE_UNIT: "[ERROR] 금액을 1,000원 단위로 나누어 떨어지게 입력해주세요!.",
    PRICE_OVER: "[ERROR] 금액은 100,000원 이상 구매할 수 없습니다!.",
    TARGET_NUMBER_LENGTH: "[ERROR] 당첨번호는 쉼표로 구분되어야 한다.",
    TARGET_NUMBER_DUPLICATED: "[ERROR] 당첨번호에 중복되는 값이 있습니다! 다시 입력해주세요.",
    LOTTO_NUMBER_RANGE: "[ERROR] 당첨번호 중 1~45 사이의 숫자가 아닌 값이 있습니다!",
    BONUS_NUMBER_TYPE: "[ERROR] 보너스 번호를 숫자로 입력해주세요!",
    BONUS_NUMBER_RANGE: "[ERROR] 보너스 번호를 1~45 사이의 숫자로 입력해주세요!",
    BONUS_NUMBER_DUPLICATE: "[ERROR] 보너스 번호는 당첨번호와 중복 될 수 없습니다!",
    RESTART_STRING: "[ERROR] 다시 시작하기 위한 입력은 y또는 n이어야 한다."
  }
});
const state = {
  lottoGame: null
};
const lottoStatus = document.querySelector("#lotto-status");
const lottoTicketList = document.querySelector("#lotto-ticket-list");
const lottoTicketTemplate = document.querySelector("#lotto-ticket");
const LottoListDisplay = {
  showLottoAmount(lottoNum) {
    lottoStatus.textContent = `총 ${lottoNum}개를 구매하였습니다.`;
  },
  showLottoListDisplay() {
    lottoTicketList.replaceChildren();
    state.lottoGame.lottos.forEach((lotto) => {
      const lottoTicketClone = lottoTicketTemplate.content.cloneNode(true);
      lottoTicketClone.querySelector("#lotto-ticket-number").textContent = lotto.getLottoNumber().join(", ");
      lottoTicketList.appendChild(lottoTicketClone);
    });
  },
  reset() {
    lottoStatus.textContent = Constants.MESSAGE.NO_LOTTO;
    lottoTicketList.replaceChildren();
  }
};
class ListChecker {
  static isDefineLength(list, value) {
    return list.length === value;
  }
  static hasDuplicateValue(list) {
    const set = new Set(list);
    return list.length !== set.size;
  }
  static isUphillList(list) {
    return list.every((element, i) => i === 0 || list[i - 1] < element);
  }
  static includeValue(targetList, values) {
    const isInclude = targetList.includes(values);
    return isInclude;
  }
}
class StringChecker {
  static isRegString(string, regExp) {
    return regExp.test(string);
  }
  static isExactString(string, value) {
    return string === value;
  }
}
class NumberChecker {
  static isLessThan(number, value) {
    return number < value;
  }
  static isMoreThan(number, value) {
    return number > value;
  }
  static isUnitNumber(number, unit) {
    return number % unit === 0;
  }
}
class Validator {
  static isPrice(priceString) {
    if (!StringChecker.isRegString(priceString, /^[0-9]+$/))
      throw new Error(Constants.ERROR.PRICE_TYPE);
    if (!NumberChecker.isUnitNumber(Number(priceString), Constants.LOTTO.UNIT))
      throw new Error(Constants.ERROR.PRICE_UNIT);
    if (NumberChecker.isMoreThan(Number(priceString), Constants.LOTTO.MAX_PRICE))
      throw new Error(Constants.ERROR.PRICE_OVER);
  }
  static isTargetNumber(targetNumberString) {
    const targetArray = targetNumberString.split(Constants.OPERATOR.SEPARATOR).map((a) => a.trim());
    if (!ListChecker.isDefineLength(targetArray, 6))
      throw new Error(Constants.ERROR.TARGET_NUMBER_LENGTH);
    if (ListChecker.hasDuplicateValue(targetArray))
      throw new Error(Constants.ERROR.TARGET_NUMBER_DUPLICATED);
    if (targetArray.some(
      (num) => !StringChecker.isRegString(num, /^[0-9]+$/) || NumberChecker.isMoreThan(Number(num), Constants.LOTTO.MAX_NUMBER) || NumberChecker.isLessThan(Number(num), Constants.LOTTO.MIN_NUMBER)
    ))
      throw new Error(Constants.ERROR.LOTTO_NUMBER_RANGE);
  }
  static isBonusNumber(bonusNumberString, targetNumber) {
    if (!StringChecker.isRegString(bonusNumberString, /^[0-9]+$/))
      throw new Error(Constants.ERROR.BONUS_NUMBER_TYPE);
    if (NumberChecker.isMoreThan(Number(bonusNumberString), 45))
      throw new Error(Constants.ERROR.BONUS_NUMBER_RANGE);
    if (NumberChecker.isLessThan(Number(bonusNumberString), 1))
      throw new Error(Constants.ERROR.BONUS_NUMBER_RANGE);
    if (ListChecker.includeValue(targetNumber, Number(bonusNumberString)))
      throw new Error(Constants.ERROR.BONUS_NUMBER_DUPLICATE);
  }
  static isRestartString(restartString) {
    if (!StringChecker.isExactString(restartString, "y") && !StringChecker.isExactString(restartString, "n"))
      throw new Error(Constants.ERROR.RESTART_STRING);
  }
}
class InputChecker {
  static price(priceInputString) {
    try {
      Validator.isPrice(priceInputString);
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    }
  }
  static numbers(targetNumberString, bonusNumberString) {
    try {
      Validator.isTargetNumber(targetNumberString);
      const targetNumberList = targetNumberString.split(Constants.OPERATOR.SEPARATOR).map((a) => Number(a.trim()));
      Validator.isBonusNumber(bonusNumberString, targetNumberList);
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    }
  }
}
const priceInput = document.querySelector("#price");
const buyButton = document.querySelector("#buy");
const PriceInputForm = {
  init() {
    buyButton.addEventListener("click", () => this.submitPrice());
  },
  submitPrice() {
    const priceInputString = priceInput.value;
    if (!InputChecker.price(priceInputString)) return;
    this.onPriceSubmit(priceInputString);
  },
  onPriceSubmit() {
    console.log("onPriceSubmit 미설정");
  },
  reset() {
    priceInput.value = "";
  }
};
const getResultButton = document.querySelector("#getResult");
const targetNumberInputList = document.querySelectorAll("#target");
const bonusNumberInput = document.querySelector("#bonus");
const WinningLottoInputForm = {
  init() {
    getResultButton.addEventListener("click", () => this.submitNumbers());
  },
  submitNumbers() {
    if (state.lottoGame === null) {
      alert(Constants.ERROR.NO_LOTTO);
      return;
    }
    const targetNumberString = [...targetNumberInputList].map((targetNumberInput) => targetNumberInput.value).join(Constants.OPERATOR.SEPARATOR);
    const bonusNumberString = bonusNumberInput.value;
    if (!InputChecker.numbers(targetNumberString, bonusNumberString)) return;
    this.onSubmitNumbers(targetNumberString, bonusNumberString);
  },
  onSubmitNumbers() {
    console.log("onSubmitNumbers 미설정");
  },
  reset() {
    targetNumberInputList.forEach(
      (targetNumberInput) => targetNumberInput.value = ""
    );
    bonusNumberInput.value = "";
  }
};
class Lotto {
  constructor(numbers) {
    this.numbers = numbers;
  }
  getLottoNumber() {
    return this.numbers;
  }
  getCorrectNumber(targetNumber) {
    return this.numbers.filter((num) => targetNumber.includes(num)).length;
  }
  hasBonusNumber(bonusNumber) {
    return this.numbers.includes(bonusNumber);
  }
}
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
class LottoGame {
  constructor(amount) {
    __privateAdd(this, _LottoGame_instances);
    this.result = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };
    this.lottos = Array.from(
      { length: amount },
      () => new Lotto(makeOneLottoArray())
    );
  }
  getGameResult() {
    return this.result;
  }
  calculate(targetNumber, bonusNumber) {
    __privateMethod(this, _LottoGame_instances, resetResult_fn).call(this);
    this.lottos.forEach((lotto) => {
      const correctNumber = lotto.getCorrectNumber(targetNumber);
      const isBonus = lotto.hasBonusNumber(bonusNumber);
      if (correctNumber === Constants.LOTTO.CORRECT_NUMBER.FIFTH)
        this.result["5"] += 1;
      if (correctNumber === Constants.LOTTO.CORRECT_NUMBER.FOURTH)
        this.result["4"] += 1;
      if (correctNumber === Constants.LOTTO.CORRECT_NUMBER.THIRD && !isBonus)
        this.result["3"] += 1;
      if (correctNumber === Constants.LOTTO.CORRECT_NUMBER.SECOND && isBonus)
        this.result["2"] += 1;
      if (correctNumber === Constants.LOTTO.CORRECT_NUMBER.FIRST)
        this.result["1"] += 1;
    });
  }
  getWinMoney() {
    return this.result["5"] * Constants.LOTTO.PRIZE.FIFTH + this.result["4"] * Constants.LOTTO.PRIZE.FOURTH + this.result["3"] * Constants.LOTTO.PRIZE.THIRD + this.result["2"] * Constants.LOTTO.PRIZE.SECOND + this.result["1"] * Constants.LOTTO.PRIZE.FIRST;
  }
  getEarningRate() {
    const rawEarningRate = this.getWinMoney() / (this.lottos.length * Constants.LOTTO.UNIT) * 100;
    return rawEarningRate.toFixed(1);
  }
}
_LottoGame_instances = new WeakSet();
resetResult_fn = function() {
  this.result = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };
};
const resultModal = document.querySelector(".modal-background");
const closeButton = document.querySelector("#close");
const restartButton = document.querySelector("#restart");
const ResultModal = {
  init() {
    closeButton.addEventListener("click", () => this.close());
    restartButton.addEventListener("click", () => this.onRestart());
  },
  setValue(gameResult, earningRate) {
    resultModal.querySelector(
      "#fifth-count"
    ).textContent = `${gameResult["5"]}개`;
    resultModal.querySelector(
      "#fourth-count"
    ).textContent = `${gameResult["4"]}개`;
    resultModal.querySelector(
      "#third-count"
    ).textContent = `${gameResult["3"]}개`;
    resultModal.querySelector(
      "#second-count"
    ).textContent = `${gameResult["2"]}개`;
    resultModal.querySelector(
      "#first-count"
    ).textContent = `${gameResult["1"]}개`;
    resultModal.querySelector(
      "#earning-rate"
    ).textContent = `당신의 총 수익률은 ${earningRate}%입니다.`;
  },
  show() {
    resultModal.style.visibility = "visible";
  },
  close() {
    resultModal.style.visibility = "hidden";
  },
  onRestart() {
    console.log("onRestart 미정의");
  }
};
const headerTitle = document.querySelector("#header-title");
headerTitle.addEventListener("click", () => {
  location.reload();
});
PriceInputForm.init();
PriceInputForm.onPriceSubmit = (priceInputString) => {
  const lottoNum = Number(priceInputString) / Constants.LOTTO.UNIT;
  state.lottoGame = new LottoGame(lottoNum);
  LottoListDisplay.showLottoAmount(lottoNum);
  LottoListDisplay.showLottoListDisplay();
};
WinningLottoInputForm.init();
WinningLottoInputForm.onSubmitNumbers = (targetNumberString, bonusNumberString) => {
  const targetNumber = targetNumberString.split(Constants.OPERATOR.SEPARATOR).map((a) => Number(a.trim()));
  const bonusNumber = Number(bonusNumberString);
  state.lottoGame.calculate(targetNumber, bonusNumber);
  ResultModal.setValue(
    state.lottoGame.getGameResult(),
    state.lottoGame.getEarningRate()
  );
  ResultModal.show();
};
ResultModal.init();
ResultModal.onRestart = () => {
  PriceInputForm.reset();
  LottoListDisplay.reset();
  WinningLottoInputForm.reset();
  ResultModal.close();
};
