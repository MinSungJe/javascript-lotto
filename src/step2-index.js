/**
 * step 2의 시작점이 되는 파일입니다.
 * 노드 환경에서 사용하는 readline 등을 불러올 경우 정상적으로 빌드할 수 없습니다.
 */
const app = document.querySelector("#app");
const lottoContainer = document.querySelector(".lotto-container");

const resultModalTemplate = document.querySelector("#result-modal");
const lottoTicketTemplate = document.querySelector("#lotto-ticket");

const resultModalClone = resultModalTemplate.content.cloneNode(true);
const lottoTicketClone = lottoTicketTemplate.content.cloneNode(true);
// app.prepend(resultModalClone);
lottoContainer.appendChild(lottoTicketClone);
