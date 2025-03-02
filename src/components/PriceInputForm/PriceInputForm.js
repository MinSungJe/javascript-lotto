import InputChecker from "../../view/step2/InputChecker.js";
import { buyButton, priceInput } from "./elements.js";

const PriceInputForm = {
  init() {
    buyButton.addEventListener("click", () => this.submitPrice());
  },

  submitPrice() {
    const priceInputString = priceInput.value;
    if (!InputChecker.price(priceInputString)) return;
    this.onPriceSubmit(priceInputString);
  },

  onPriceSubmit() {
    console.log("onPriceSubmit 미설정");
  },

  reset() {
    priceInput.value = "";
  },
};

export default PriceInputForm;
