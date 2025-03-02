import Constants from "../../constant/Constants.js";
import state from "../state.js";
import {
  lottoStatus,
  lottoTicketList,
  lottoTicketTemplate,
} from "./elements.js";

const LottoListDisplay = {
  showLottoAmount(lottoNum) {
    lottoStatus.textContent = `총 ${lottoNum}개를 구매하였습니다.`;
  },

  showLottoListDisplay() {
    lottoTicketList.replaceChildren();
    state.lottoGame.lottos.forEach((lotto) => {
      const lottoTicketClone = lottoTicketTemplate.content.cloneNode(true);
      lottoTicketClone.querySelector("#lotto-ticket-number").textContent = lotto
        .getLottoNumber()
        .join(", ");
      lottoTicketList.appendChild(lottoTicketClone);
    });
  },

  reset() {
    lottoStatus.textContent = Constants.MESSAGE.NO_LOTTO;
    lottoTicketList.replaceChildren();
  },
};

export default LottoListDisplay;
