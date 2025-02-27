import Constants from "./constant/Constants.js";
import OutputView from "./view/step2/OutputView.js";

class App2 {
  lottoNum;
  lottoGame;

  constructor(
    app,
    lottoContainer,
    lottoTicketList,
    lottoTicketTemplate,
    resultModalTemplate
  ) {
    this.app = app;
    this.lottoContainer = lottoContainer;
    this.lottoTicketList = lottoTicketList;
    this.lottoTicketTemplate = lottoTicketTemplate;
    this.resultModalTemplate = resultModalTemplate;
  }

  addEventListeners() {
    this.#addEventHeaderTitle();
    this.#addEventBuyButton();
    this.#addEventGetResultButton();
  }

  #addEventHeaderTitle() {
    const headerTitle = this.app.querySelector("#header-title");
    headerTitle.addEventListener("click", () => {
      location.reload();
    });
  }

  #addEventBuyButton() {
    const buyButton = this.app.querySelector("#buy");

    buyButton.addEventListener("click", () => {
      const priceInputString = this.app.querySelector("#price").value;
      if (!checkCanPriceInput(priceInputString)) return;
      this.lottoNum = Number(priceInputString) / Constants.LOTTO.UNIT;
      OutputView.displayLotto(lottoNum);
    });
  }

  #addEventGetResultButton() {
    const getResultButton = this.app.querySelector("#getResult");
    getResultButton.addEventListener("click", () => {
      if (this.lottoGame === undefined) {
        alert(Constants.ERROR.NO_LOTTO);
        return;
      }

      const targetNumberInputList = this.app.querySelectorAll("#target");
      const targetNumberString = [...targetNumberInputList]
        .map((targetNumberInput) => targetNumberInput.value)
        .join(Constants.OPERATOR.SEPARATOR);
      const bonusNumberString = this.app.querySelector("#bonus").value;

      if (!checkCanNumberInput(targetNumberString, bonusNumberString)) return;

      const targetNumber = targetNumberString
        .split(Constants.OPERATOR.SEPARATOR)
        .map((a) => Number(a.trim()));
      const bonusNumber = Number(bonusNumberString);
      this.lottoGame.calculate(targetNumber, bonusNumber);

      displayResult(
        this.lottoGame.getGameResult(),
        this.lottoGame.getEarningRate(this.lottoNum)
      );
    });
  }
}

export default App2;
