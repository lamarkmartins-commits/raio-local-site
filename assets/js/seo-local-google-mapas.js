(() => {
  "use strict";

  const search = document.querySelector("#searchText");
  const phrases = ["dentista perto de mim", "pizzaria em João Pessoa", "eletricista no Centro", "clínica em Manaíra"];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (search) {
    if (reduced) {
      search.textContent = phrases[0];
    } else {
      let phraseIndex = 0;
      let position = 0;
      let deleting = false;
      const type = () => {
        const phrase = phrases[phraseIndex];
        search.textContent = phrase.slice(0, position);
        if (!deleting && position < phrase.length) {
          position += 1;
          window.setTimeout(type, 58);
        } else if (!deleting) {
          deleting = true;
          window.setTimeout(type, 1700);
        } else if (position > 0) {
          position -= 1;
          window.setTimeout(type, 28);
        } else {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          window.setTimeout(type, 350);
        }
      };
      type();
    }
  }

  const simulator = document.querySelector("#localSimulator");
  if (simulator) {
    const buttons = [...simulator.querySelectorAll("[data-sim]")];
    const cards = [...simulator.querySelectorAll(".rank-card")];
    const applyState = state => {
      simulator.dataset.state = state;
      cards.forEach(card => {
        const isCompany = card.classList.contains("rank-card--me");
        card.style.order = state === "on" ? card.dataset.on : card.dataset.off;
        if (isCompany) {
          card.querySelector(".rank-pos").textContent = state === "on" ? "1" : "7";
          card.querySelector(".rank-tag").textContent = state === "on" ? "#1 no Maps" : "Posição #7";
        }
      });
      buttons.forEach(button => {
        const active = button.dataset.sim === state;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      const status = simulator.querySelector(".sim-status");
      if (status) status.textContent = state === "on" ? "Com SEO Local: sua empresa assume a primeira posição no mapa." : "Sem otimização: sua empresa aparece na posição sete.";
    };
    buttons.forEach(button => button.addEventListener("click", () => applyState(button.dataset.sim)));
    applyState("off");
  }
})();
