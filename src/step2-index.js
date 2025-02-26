/**
 * step 2의 시작점이 되는 파일입니다.
 * 노드 환경에서 사용하는 readline 등을 불러올 경우 정상적으로 빌드할 수 없습니다.
 */
import Constants from "./constant/Constants.js";
import LottoGame from "./domain/LottoGame.js";
import Validator from "./domain/Validator.js";

const app = document.querySelector("#app");
const lottoContainer = document.querySelector(".lotto-container");
const lottoTicketList = document.querySelector(".lotto-ticket-list");
const buyButton = document.querySelector("#buy");
const getResultButton = document.querySelector("#getResult");

const lottoTicketTemplate = document.querySelector("#lotto-ticket");
const resultModalTemplate = document.querySelector("#result-modal");

let lottoNum;
let lottoGame;

const checkCanPriceInput = (priceInputString) => {
  try {
    Validator.isPrice(priceInputString);
    return true;
  } catch (error) {
    alert(error.message);
    return false;
  }
};

const checkCanNumberInput = (targetNumberString, bonusNumberString) => {
  try {
    Validator.isTargetNumber(targetNumberString);

    const targetNumberList = targetNumberString
      .split(Constants.OPERATOR.SEPARATOR)
      .map((a) => Number(a.trim()));

    Validator.isBonusNumber(bonusNumberString, targetNumberList);

    return true;
  } catch (error) {
    alert(error.message);
    return false;
  }
};

const displayLotto = (lottoNum) => {
  lottoGame = new LottoGame(lottoNum);
  lottoContainer.querySelector(
    "#lotto-status"
  ).textContent = `총 ${lottoNum}개를 구매하였습니다.`;

  lottoTicketList.replaceChildren();
  lottoGame.lottos.forEach((lotto) => {
    const lottoTicketClone = lottoTicketTemplate.content.cloneNode(true);
    lottoTicketClone.querySelector(".lotto-ticket-number").textContent = lotto
      .getLottoNumber()
      .join(", ");
    lottoTicketList.appendChild(lottoTicketClone);
  });
};

const displayResult = (gameResult, earningRate) => {
  const resultModalClone = resultModalTemplate.content.cloneNode(true);
  resultModalClone.querySelector(
    "#fifth-count"
  ).textContent = `${gameResult["5"]}개`;
  resultModalClone.querySelector(
    "#fourth-count"
  ).textContent = `${gameResult["4"]}개`;
  resultModalClone.querySelector(
    "#third-count"
  ).textContent = `${gameResult["3"]}개`;
  resultModalClone.querySelector(
    "#second-count"
  ).textContent = `${gameResult["2"]}개`;
  resultModalClone.querySelector(
    "#first-count"
  ).textContent = `${gameResult["1"]}개`;
  resultModalClone.querySelector(
    "#earning-rate"
  ).textContent = `당신의 총 수익률은 ${earningRate}%입니다.`;
  app.prepend(resultModalClone);
};

buyButton.addEventListener("click", () => {
  const priceInputString = document.querySelector("#price").value;
  if (!checkCanPriceInput(priceInputString)) return;
  lottoNum = Number(priceInputString) / Constants.LOTTO.UNIT;
  displayLotto(lottoNum);
});

getResultButton.addEventListener("click", () => {
  const targetNumberInputList = document.querySelectorAll("#target");
  const targetNumberString = [...targetNumberInputList]
    .map((targetNumberInput) => targetNumberInput.value)
    .join(Constants.OPERATOR.SEPARATOR);
  const bonusNumberString = document.querySelector("#bonus").value;
  if (!checkCanNumberInput(targetNumberString, bonusNumberString)) return;

  const targetNumber = targetNumberString
    .split(Constants.OPERATOR.SEPARATOR)
    .map((a) => Number(a.trim()));
  const bonusNumber = Number(bonusNumberString);

  lottoGame.calculate(targetNumber, bonusNumber);
  displayResult(lottoGame.getGameResult(), lottoGame.getEarningRate(lottoNum));
});
