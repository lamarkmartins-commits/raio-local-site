(() => {
  "use strict";

  document.querySelector("#profileSimulator")?.remove();

  const pageTitle = document.querySelector("#titulo-principal");
  if (pageTitle) pageTitle.innerHTML = 'Consultoria em <span class="hl">Google Perfil da Empresa</span> (Antigo Meu Negócio)';

  const tabs = [...document.querySelectorAll(".post-tab")];
  const previews = [...document.querySelectorAll(".post-preview")];
  tabs.forEach(tab => tab.addEventListener("click", () => {
    tabs.forEach(item => { const active = item === tab; item.classList.toggle("is-active", active); item.setAttribute("aria-pressed", String(active)); });
    previews.forEach(preview => preview.classList.toggle("is-active", preview.dataset.post === tab.dataset.post));
  }));

  const simulator = document.querySelector("#profileSimulator");
  if (simulator) {
    const boxes = [...simulator.querySelectorAll("input[type=checkbox]")];
    const card = simulator.querySelector(".profile-card");
    const percent = simulator.querySelector(".profile-percent");
    const status = simulator.querySelector(".profile-sim-status");
    const refresh = () => {
      const count = boxes.filter(box => box.checked).length;
      const value = Math.round(count / boxes.length * 100);
      card.classList.toggle("is-complete", value === 100);
      percent.textContent = `${value}% otimizado`;
      status.textContent = value === 100 ? "Perfil completo e pronto para converter visitas em contatos." : `Perfil em construção: ${value}% dos pontos essenciais configurados.`;
    };
    boxes.forEach(box => box.addEventListener("change", refresh));
    refresh();
  }
})();
