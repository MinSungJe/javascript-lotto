/**
 * step 2의 시작점이 되는 파일입니다.
 * 노드 환경에서 사용하는 readline 등을 불러올 경우 정상적으로 빌드할 수 없습니다.
 */
import LottoListDisplay from "./components/LottoListDisplay/LottoListDisplay.js";
import PriceInputForm from "./components/PriceInputForm/PriceInputForm.js";
import state from "./components/state.js";
import WinningLottoInputForm from "./components/WinningLottoInputForm/WinningLottoInputForm.js";
import Constants from "./constant/Constants.js";
import LottoGame from "./domain/LottoGame.js";
import ResultModal from "./view/step2/ResultModal.js";

const app = document.querySelector("#app");
const lottoContainer = app.querySelector(".lotto-container");
const lottoTicketList = app.querySelector("#lotto-ticket-list");

const headerTitle = app.querySelector("#header-title");
const restartButton = app.querySelector("#restart");
const closeButton = app.querySelector("#close");

const resultModal = new ResultModal();

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
WinningLottoInputForm.onSubmitNumbers = (
  targetNumberString,
  bonusNumberString
) => {
  const targetNumber = targetNumberString
    .split(Constants.OPERATOR.SEPARATOR)
    .map((a) => Number(a.trim()));
  const bonusNumber = Number(bonusNumberString);

  state.lottoGame.calculate(targetNumber, bonusNumber);
  resultModal.show(
    state.lottoGame.getGameResult(),
    state.lottoGame.getEarningRate()
  );
};

closeButton.addEventListener("click", () => {
  resultModal.close();
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
  resultModal.close();
});
