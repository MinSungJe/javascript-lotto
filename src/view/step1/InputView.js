import readLineAsync from "./readLineAsync.js";

class InputView {
  static async getInput(message) {
    const rawData = await readLineAsync(message);
    return rawData;
  }
}

export default InputView;
