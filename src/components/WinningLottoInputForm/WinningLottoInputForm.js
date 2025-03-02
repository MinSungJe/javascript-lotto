import Constants from "../../constant/Constants.js";
import InputChecker from "../../view/step2/InputChecker.js";
import state from "../state.js";
import {
  bonusNumberInput,
  getResultButton,
  targetNumberInputList,
} from "./elements.js";

const WinningLottoInputForm = {
  init() {
    getResultButton.addEventListener("click", () => this.submitNumbers());
  },

  submitNumbers() {
    if (state.lottoGame === null) {
      alert(Constants.ERROR.NO_LOTTO);
      return;
    }

    const targetNumberString = [...targetNumberInputList]
      .map((targetNumberInput) => targetNumberInput.value)
      .join(Constants.OPERATOR.SEPARATOR);
    const bonusNumberString = bonusNumberInput.value;

    if (!InputChecker.numbers(targetNumberString, bonusNumberString)) return;

    this.onSubmitNumbers(targetNumberString, bonusNumberString);
  },

  onSubmitNumbers() {
    console.log("onSubmitNumbers 미설정");
  },

  reset() {
    targetNumberInputList.forEach(
      (targetNumberInput) => (targetNumberInput.value = "")
    );
    bonusNumberInput.value = "";
  },
};

export default WinningLottoInputForm;
