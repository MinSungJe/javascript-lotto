import Constants from "../../constant/Constants.js";
import Validator from "../../domain/Validator.js";

export const checkCanPriceInput = (priceInputString) => {
  try {
    Validator.isPrice(priceInputString);
    return true;
  } catch (error) {
    alert(error.message);
    return false;
  }
};

export const checkCanNumberInput = (targetNumberString, bonusNumberString) => {
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
