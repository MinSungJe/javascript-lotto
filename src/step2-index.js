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
import ResultModal from "./components/ResultModal/ResultModal.js";

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
WinningLottoInputForm.onSubmitNumbers = (
  targetNumberString,
  bonusNumberString
) => {
  const targetNumber = targetNumberString
    .split(Constants.OPERATOR.SEPARATOR)
    .map((a) => Number(a.trim()));
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
