/**
 * step 2의 시작점이 되는 파일입니다.
 * 노드 환경에서 사용하는 readline 등을 불러올 경우 정상적으로 빌드할 수 없습니다.
 */
import Constants from "./constant/Constants.js";
import LottoGame from "./domain/LottoGame.js";
import Validator from "./domain/Validator.js";

const app = document.querySelector("#app");
const lottoContainer = app.querySelector(".lotto-container");
const lottoTicketList = app.querySelector("#lotto-ticket-list");

const headerTitle = app.querySelector("#header-title");
const buyButton = app.querySelector("#buy");
const getResultButton = app.querySelector("#getResult");

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
    lottoTicketClone.querySelector("#lotto-ticket-number").textContent = lotto
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
  addEventCloseButton();
  addEventRestartButton();
};

const addEventCloseButton = () => {
  const closeButton = app.querySelector("#close");
  const resultModal = app.querySelector(".modal-background");
  closeButton.addEventListener("click", () => {
    app.removeChild(resultModal);
  });
};

const addEventRestartButton = () => {
  const restartButton = app.querySelector("#restart");
  const resultModal = app.querySelector(".modal-background");
  const priceInput = app.querySelector("#price");
  const targetNumberInputList = app.querySelectorAll("#target");
  const bonusNumberInput = app.querySelector("#bonus");

  restartButton.addEventListener("click", () => {
    lottoGame = undefined;
    lottoContainer.querySelector("#lotto-status").textContent =
      "아직 로또를 구매하지 않았습니다!";
    lottoTicketList.replaceChildren();
    priceInput.value = "";
    targetNumberInputList.forEach(
      (targetNumberInput) => (targetNumberInput.value = "")
    );
    bonusNumberInput.value = "";
    app.removeChild(resultModal);
  });
};

headerTitle.addEventListener("click", () => {
  location.reload();
});

buyButton.addEventListener("click", () => {
  const priceInputString = app.querySelector("#price").value;
  if (!checkCanPriceInput(priceInputString)) return;
  lottoNum = Number(priceInputString) / Constants.LOTTO.UNIT;
  displayLotto(lottoNum);
});

getResultButton.addEventListener("click", () => {
  if (lottoGame === undefined) {
    alert(Constants.ERROR.NO_LOTTO);
    return;
  }

  const targetNumberInputList = app.querySelectorAll("#target");
  const targetNumberString = [...targetNumberInputList]
    .map((targetNumberInput) => targetNumberInput.value)
    .join(Constants.OPERATOR.SEPARATOR);
  const bonusNumberString = app.querySelector("#bonus").value;

  if (!checkCanNumberInput(targetNumberString, bonusNumberString)) return;

  const targetNumber = targetNumberString
    .split(Constants.OPERATOR.SEPARATOR)
    .map((a) => Number(a.trim()));
  const bonusNumber = Number(bonusNumberString);
  lottoGame.calculate(targetNumber, bonusNumber);

  displayResult(lottoGame.getGameResult(), lottoGame.getEarningRate(lottoNum));
});
