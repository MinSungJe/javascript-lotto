import Constants from "../../constant/Constants.js";
import Validator from "../../domain/Validator.js";

class InputChecker {
  static price(priceInputString) {
    try {
      Validator.isPrice(priceInputString);
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    }
  }

  static numbers(targetNumberString, bonusNumberString) {
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
  }
}

export default InputChecker;
