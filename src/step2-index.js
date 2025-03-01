/**
 * step 2의 시작점이 되는 파일입니다.
 * 노드 환경에서 사용하는 readline 등을 불러올 경우 정상적으로 빌드할 수 없습니다.
 */
import PriceInputForm from "./components/PriceInputForm/PriceInputForm.js";
import state from "./components/state.js";
import Constants from "./constant/Constants.js";
import LottoGame from "./domain/LottoGame.js";
import InputChecker from "./view/step2/InputChecker.js";
import ResultModal from "./view/step2/ResultModal.js";

const app = document.querySelector("#app");
const lottoContainer = app.querySelector(".lotto-container");
const lottoTicketList = app.querySelector("#lotto-ticket-list");

const headerTitle = app.querySelector("#header-title");
const buyButton = app.querySelector("#buy");
const getResultButton = app.querySelector("#getResult");
const restartButton = app.querySelector("#restart");
const closeButton = app.querySelector("#close");

const lottoTicketTemplate = document.querySelector("#lotto-ticket");
const resultModal = new ResultModal();

let lottoGame = state.lottoGame;

headerTitle.addEventListener("click", () => {
  location.reload();
});

PriceInputForm.init();

PriceInputForm.onPriceSubmit = (price) => {
  const lottoNum = Number(price) / Constants.LOTTO.UNIT;

  lottoGame = new LottoGame(lottoNum);

  // 이 뒤부터는 밍고가 한번 구현해보시는 것을 추천합니다.
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

  if (!InputChecker.numbers(targetNumberString, bonusNumberString)) return;

  const targetNumber = targetNumberString
    .split(Constants.OPERATOR.SEPARATOR)
    .map((a) => Number(a.trim()));
  const bonusNumber = Number(bonusNumberString);
  lottoGame.calculate(targetNumber, bonusNumber);

  resultModal.show(lottoGame.getGameResult(), lottoGame.getEarningRate());
});

closeButton.addEventListener("click", () => {
  resultModal.close();
});

restartButton.addEventListener("click", () => {
  PriceInputForm.reset();

  const targetNumberInputList = app.querySelectorAll("#target");
  const bonusNumberInput = app.querySelector("#bonus");

  lottoGame = undefined;
  lottoContainer.querySelector("#lotto-status").textContent =
    "아직 로또를 구매하지 않았습니다!";
  lottoTicketList.replaceChildren();
  targetNumberInputList.forEach(
    (targetNumberInput) => (targetNumberInput.value = "")
  );
  bonusNumberInput.value = "";
  resultModal.close();
});
