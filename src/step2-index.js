/**
 * step 2의 시작점이 되는 파일입니다.
 * 노드 환경에서 사용하는 readline 등을 불러올 경우 정상적으로 빌드할 수 없습니다.
 */
const lottoContainer = document.querySelector(".lotto-container");
const lottoTicketTemplate = document.getElementById("lotto-ticket");

const lottoTicketClone = lottoTicketTemplate.content.cloneNode(true);
lottoContainer.appendChild(lottoTicketClone);
