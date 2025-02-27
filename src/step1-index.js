/**
 * step 1의 시작점이 되는 파일입니다.
 * 브라우저 환경에서 사용하는 css 파일 등을 불러올 경우 정상적으로 빌드할 수 없습니다.
 */

import App1 from "./App1.js";

export default async function run() {
  const app = new App1();
  let retryAnswer = "y";
  while (retryAnswer !== "n") {
    retryAnswer = await app.run();
  }
}

await run();
