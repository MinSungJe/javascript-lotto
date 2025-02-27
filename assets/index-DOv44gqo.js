var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _LottoGame_instances, resetResult_fn, _resultModal, _setValue;
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
    RESTART_STRING: "> 다시 시작하시겠습니까? (y/n) "
  },
  ERROR: {
    NO_LOTTO: "[ERROR] 로또를 구매하지 않으셨습니다!",
    PRICE_TYPE: "[ERROR] 금액은 숫자로 입력해야 한다.",
    PRICE_UNIT: "[ERROR] 금액은 1,000원으로 나누어 떨어져야 한다.",
    TARGET_NUMBER_LENGTH: "[ERROR] 당첨번호는 쉼표로 구분되어야 한다.",
    TARGET_NUMBER_DUPLICATED: "[ERROR] 당첨번호는 중복되는 값을 가질 수 없다.",
    LOTTO_NUMBER_RANGE: "[ERROR] 당첨번호는 1~45 사이의 숫자이어야한다.",
    BONUS_NUMBER_TYPE: "[ERROR] 보너스 번호는 숫자이어야 한다.",
    BONUS_NUMBER_RANGE: "[ERROR] 보너스 번호의 범위는 1~45이어야한다.",
    BONUS_NUMBER_DUPLICATE: "[ERROR] 보너스 번호는 당첨번호와 중복될수 없다.",
    RESTART_STRING: "[ERROR] 다시 시작하기 위한 입력은 y또는 n이어야 한다."
  }
});
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
class ResultModal {
  constructor() {
    __privateAdd(this, _resultModal);
    __privateAdd(this, _setValue, (gameResult, earningRate) => {
      __privateGet(this, _resultModal).querySelector(
        "#fifth-count"
      ).textContent = `${gameResult["5"]}개`;
      __privateGet(this, _resultModal).querySelector(
        "#fourth-count"
      ).textContent = `${gameResult["4"]}개`;
      __privateGet(this, _resultModal).querySelector(
        "#third-count"
      ).textContent = `${gameResult["3"]}개`;
      __privateGet(this, _resultModal).querySelector(
        "#second-count"
      ).textContent = `${gameResult["2"]}개`;
      __privateGet(this, _resultModal).querySelector(
        "#first-count"
      ).textContent = `${gameResult["1"]}개`;
      __privateGet(this, _resultModal).querySelector(
        "#earning-rate"
      ).textContent = `당신의 총 수익률은 ${earningRate}%입니다.`;
    });
    __privateSet(this, _resultModal, app.querySelector(".modal-background"));
  }
  show(gameResult, earningRate) {
    __privateGet(this, _setValue).call(this, gameResult, earningRate);
    __privateGet(this, _resultModal).style.visibility = "visible";
  }
  close() {
    __privateGet(this, _resultModal).style.visibility = "hidden";
  }
}
_resultModal = new WeakMap();
_setValue = new WeakMap();
const app$1 = document.querySelector("#app");
const lottoContainer = app$1.querySelector(".lotto-container");
const lottoTicketList = app$1.querySelector("#lotto-ticket-list");
const headerTitle = app$1.querySelector("#header-title");
const buyButton = app$1.querySelector("#buy");
const getResultButton = app$1.querySelector("#getResult");
const restartButton = app$1.querySelector("#restart");
const closeButton = app$1.querySelector("#close");
const lottoTicketTemplate = document.querySelector("#lotto-ticket");
const resultModal = new ResultModal();
let lottoGame;
headerTitle.addEventListener("click", () => {
  location.reload();
});
buyButton.addEventListener("click", () => {
  const priceInputString = app$1.querySelector("#price").value;
  if (!InputChecker.price(priceInputString)) return;
  const lottoNum = Number(priceInputString) / Constants.LOTTO.UNIT;
  lottoGame = new LottoGame(lottoNum);
  lottoContainer.querySelector(
    "#lotto-status"
  ).textContent = `총 ${lottoNum}개를 구매하였습니다.`;
  lottoTicketList.replaceChildren();
  lottoGame.lottos.forEach((lotto) => {
    const lottoTicketClone = lottoTicketTemplate.content.cloneNode(true);
    lottoTicketClone.querySelector("#lotto-ticket-number").textContent = lotto.getLottoNumber().join(", ");
    lottoTicketList.appendChild(lottoTicketClone);
  });
});
getResultButton.addEventListener("click", () => {
  if (lottoGame === void 0) {
    alert(Constants.ERROR.NO_LOTTO);
    return;
  }
  const targetNumberInputList = app$1.querySelectorAll("#target");
  const targetNumberString = [...targetNumberInputList].map((targetNumberInput) => targetNumberInput.value).join(Constants.OPERATOR.SEPARATOR);
  const bonusNumberString = app$1.querySelector("#bonus").value;
  if (!InputChecker.numbers(targetNumberString, bonusNumberString)) return;
  const targetNumber = targetNumberString.split(Constants.OPERATOR.SEPARATOR).map((a) => Number(a.trim()));
  const bonusNumber = Number(bonusNumberString);
  lottoGame.calculate(targetNumber, bonusNumber);
  resultModal.show(lottoGame.getGameResult(), lottoGame.getEarningRate());
});
closeButton.addEventListener("click", () => {
  resultModal.close();
});
restartButton.addEventListener("click", () => {
  const priceInput = app$1.querySelector("#price");
  const targetNumberInputList = app$1.querySelectorAll("#target");
  const bonusNumberInput = app$1.querySelector("#bonus");
  lottoGame = void 0;
  lottoContainer.querySelector("#lotto-status").textContent = "아직 로또를 구매하지 않았습니다!";
  lottoTicketList.replaceChildren();
  priceInput.value = "";
  targetNumberInputList.forEach(
    (targetNumberInput) => targetNumberInput.value = ""
  );
  bonusNumberInput.value = "";
  resultModal.close();
});
