import OutputView from "../view/step1/OutputView.js";

async function loopWhileValid(fn, ...args) {
  try {
    return await fn(...args);
  } catch (error) {
    OutputView.printMessage(error.message);
    OutputView.printBlank();
    return await loopWhileValid(fn, ...args);
  }
}

export default loopWhileValid;
