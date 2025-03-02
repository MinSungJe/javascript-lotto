import { closeButton, restartButton, resultModal } from "./elements.js";

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
  },
};

export default ResultModal;
