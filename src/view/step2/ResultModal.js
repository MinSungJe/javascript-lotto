class ResultModal {
  #resultModal;

  constructor() {
    this.#resultModal = app.querySelector(".modal-background");
  }

  show(gameResult, earningRate) {
    this.#setValue(gameResult, earningRate);
    this.#resultModal.style.visibility = "visible";
  }

  #setValue = (gameResult, earningRate) => {
    this.#resultModal.querySelector(
      "#fifth-count"
    ).textContent = `${gameResult["5"]}개`;
    this.#resultModal.querySelector(
      "#fourth-count"
    ).textContent = `${gameResult["4"]}개`;
    this.#resultModal.querySelector(
      "#third-count"
    ).textContent = `${gameResult["3"]}개`;
    this.#resultModal.querySelector(
      "#second-count"
    ).textContent = `${gameResult["2"]}개`;
    this.#resultModal.querySelector(
      "#first-count"
    ).textContent = `${gameResult["1"]}개`;
    this.#resultModal.querySelector(
      "#earning-rate"
    ).textContent = `당신의 총 수익률은 ${earningRate}%입니다.`;
  };

  close() {
    this.#resultModal.style.visibility = "hidden";
  }
}

export default ResultModal;
