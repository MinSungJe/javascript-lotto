import Constants from "../../constant/Constants.js";
import Validator from "../../domain/Validator.js";

const buyButton = document.querySelector("#buy");
const getResultButton = document.querySelector("#getResult");

const checkCanPriceInput = (priceInputString) => {
  try {
    Validator.isPrice(priceInputString);
    return true;
  } catch (error) {
    alert(error.message);
    return false;
  }
};

const checkCanNumberInput = (targetNumberString, bonusNumberString) => {
  try {
    Validator.isTargetNumber(targetNumberString);

    const targetNumberList = targetNumberString
      .split(Constants.OPERATOR.SEPARATOR)
      .map((a) => Number(a.trim()));

    Validator.isBonusNumber(bonusNumberString, targetNumberList);

    return true;
  } catch (error) {
    alert(error.message);
    return false;
  }
};

buyButton.addEventListener("click", () => {
  const priceInputString = document.querySelector("#price").value;
  if (!checkCanPriceInput(priceInputString)) return;
});

getResultButton.addEventListener("click", () => {
  const targetNumberInputList = document.querySelectorAll("#target");
  const targetNumberString = [...targetNumberInputList]
    .map((targetNumberInput) => targetNumberInput.value)
    .join(Constants.OPERATOR.SEPARATOR);
  const bonusNumberString = document.querySelector("#bonus").value;
  if (!checkCanNumberInput(targetNumberString, bonusNumberString)) return;
});
