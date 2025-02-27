/**
 * step 2의 시작점이 되는 파일입니다.
 * 노드 환경에서 사용하는 readline 등을 불러올 경우 정상적으로 빌드할 수 없습니다.
 */
import Constants from "./constant/Constants.js";
import LottoGame from "./domain/LottoGame.js";
import {
  checkCanNumberInput,
  checkCanPriceInput,
} from "./view/step2/InputChecker.js";

const app = document.querySelector("#app");
const lottoContainer = app.querySelector(".lotto-container");
const lottoTicketList = app.querySelector("#lotto-ticket-list");
const resultModal = app.querySelector(".modal-background");

const headerTitle = app.querySelector("#header-title");
const buyButton = app.querySelector("#buy");
const getResultButton = app.querySelector("#getResult");
const restartButton = app.querySelector("#restart");
const closeButton = app.querySelector("#close");

const lottoTicketTemplate = document.querySelector("#lotto-ticket");

let lottoGame;

const createLottos = (lottoNum) => {
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

const displayResultModal = (gameResult, earningRate) => {
  setResultModalValue(gameResult, earningRate);
  resultModal.style.visibility = "visible";
};

const setResultModalValue = (gameResult, earningRate) => {
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
};

headerTitle.addEventListener("click", () => {
  location.reload();
});

buyButton.addEventListener("click", () => {
  const priceInputString = app.querySelector("#price").value;
  if (!checkCanPriceInput(priceInputString)) return;
  const lottoNum = Number(priceInputString) / Constants.LOTTO.UNIT;
  createLottos(lottoNum);
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

  displayResultModal(lottoGame.getGameResult(), lottoGame.getEarningRate());
});

closeButton.addEventListener("click", () => {
  resultModal.style.visibility = "hidden";
});

restartButton.addEventListener("click", () => {
  const priceInput = app.querySelector("#price");
  const targetNumberInputList = app.querySelectorAll("#target");
  const bonusNumberInput = app.querySelector("#bonus");

  lottoGame = undefined;
  lottoContainer.querySelector("#lotto-status").textContent =
    "아직 로또를 구매하지 않았습니다!";
  lottoTicketList.replaceChildren();
  priceInput.value = "";
  targetNumberInputList.forEach(
    (targetNumberInput) => (targetNumberInput.value = "")
  );
  bonusNumberInput.value = "";
  resultModal.style.visibility = "hidden";
});
