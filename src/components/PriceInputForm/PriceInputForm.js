import InputChecker from "../../view/step2/InputChecker";
import { priceInput, priceSubmitButton } from "./elements";

const PriceInputForm = {
  init: () => {
    priceSubmitButton.addEventListener("click", PriceInputForm.submitPrice);
  },
  submitPrice: () => {
    const price = priceInput.value;

    if (!InputChecker.price(price)) return;

    PriceInputForm.onPriceSubmit(price);
  },
  reset: () => {
    priceInput.value = "";
  },
  onPriceSubmit: () => {
    console.log("아직 onPriceSubmit 이 설정되지 않았습니다.");
  },
};

export default PriceInputForm;
