/* ==========================================================================
   RAIO LOCAL — main.js
   Interações: header, menu, reveal, contadores, acordeões, mock SERP,
   máscara de telefone, formulário (WhatsApp/e-mail), mapa lazy, fallbacks.
   ========================================================================== */
(() => {
  "use strict";

  /* ==========================================================
     CONFIGURAÇÃO — edite apenas aqui
     ========================================================== */
  const CONFIG = {
    whatsapp: "5583987823761",
    email: "contato@raiolocal.com.br" // TODO: e-mail real
  };

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* FAQ com o mesmo cabeçalho visual da home em todas as páginas. */
  $$(".faq-intro .sec-tag").forEach(el => { el.textContent = "04 · Dúvidas frequentes"; });
  $$(".faq-intro .sec-title").forEach(el => { el.innerHTML = 'Perguntas <span class="accent"><em>Frequentes</em></span> (FAQ)'; });

  const serviceLinks = [
    ["servicos/criacao-de-sites.html", "Criação de sites"],
    ["servicos/seo-local-google-mapas.html", "SEO Local e Google Maps"],
    ["servicos/consultoria-google-perfil-da-empresa.html", "Consultoria Google Perfil"],
    ["servicos/consultoria-em-usabilidade.html", "Consultoria em Usabilidade"]
  ];
  $$(".services-submenu").forEach(submenu => {
    const basePath = location.pathname.includes("/servicos/") ? "" : "servicos/";
    serviceLinks.forEach(([path, label]) => {
      const href = basePath ? `${basePath}${path.replace("servicos/", "")}` : path.replace("servicos/", "");
      if (!submenu.querySelector(`a[href="${href}"]`)) {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = label;
        submenu.append(link);
      }
    });
  });

  /* ---------- 1. Header com fundo ao rolar ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Menu mobile ---------- */
  const toggle = $(".menu-toggle");
  const menu = $("#menu-mobile");

  const closeMenu = () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("menu-open");
    setTimeout(() => { menu.hidden = true; }, 350);
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    if (open) return closeMenu();
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add("open"));
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fechar menu");
    document.body.classList.add("menu-open");
  });

  $$('a', menu).forEach(a => a.addEventListener('click', closeMenu));
  $$('.services-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.nav-services');
      $$('.nav-services.is-open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.services-toggle').setAttribute('aria-expanded', 'false');
        }
      });
      const open = item.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-services')) {
      $$('.nav-services.is-open').forEach(item => {
        item.classList.remove('is-open');
        item.querySelector('.services-toggle').setAttribute('aria-expanded', 'false');
      });
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      $$('.nav-services.is-open').forEach(item => {
        item.classList.remove('is-open');
        item.querySelector('.services-toggle').setAttribute('aria-expanded', 'false');
      });
      if (!menu.hidden) closeMenu();
    }
  });

  /* ---------- 3. Links de WhatsApp centralizados ---------- */
  // Todo [data-wa] recebe o número do CONFIG (fonte única de verdade).
  $$("[data-wa]").forEach(a => {
    const msg = a.dataset.waMsg || "Olá, vim pelo site e quero um orçamento";
    a.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  });

  /* ---------- 4. Reveal on scroll ---------- */
  // Escalonamento dos filhos de [data-stagger]
  $$("[data-stagger]").forEach(w =>
    $$(".reveal", w).forEach((el, i) => (el.style.transitionDelay = `${i * 80}ms`))
  );

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -5% 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  /* ---------- 5. Contadores animados ---------- */
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const runCount = el => {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || "0", 10);
    if (RM) { el.textContent = target.toFixed(dec).replace(".", ","); return; }
    const dur = 1400, t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = (target * easeOut(p)).toFixed(dec).replace(".", ",");
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const ioCount = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        $$("[data-count]", e.target).forEach(runCount);
        // Dispara o mock do SERP junto (estrelas + selo)
        if (e.target.id === "serp") playSerp(e.target);
        ioCount.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  $$("[data-count]").forEach(el => ioCount.observe(el.closest(".stat, #serp") || el));

  /* ---------- 6. Acordeões (Serviços + FAQ) ---------- */
  $$("[data-single]").forEach(acc => {
    $$(".acc-head", acc).forEach(head => {
      head.addEventListener("click", () => {
        const item = head.closest(".acc-item");
        const wasOpen = item.classList.contains("open");
        $$(".acc-item.open", acc).forEach(i => {
          i.classList.remove("open");
          $(".acc-head", i).setAttribute("aria-expanded", "false");
        });
        if (!wasOpen) {
          item.classList.add("open");
          head.setAttribute("aria-expanded", "true");
        }
      });
    });
  });

  /* ---------- 7. Mock do SERP (digitação + estrelas) ---------- */
  const phrases = [
    "pizzaria em joão pessoa",
    "dentista em manaíra joão pessoa",
    "clínica de estética cabo branco",
    "advogado trabalhista joão pessoa"
  ];
  let serpStarted = false;

  function playSerp(wrap) {
    if (serpStarted) return;
    serpStarted = true;
    setTimeout(() => wrap.classList.add("in"), 1300);
    // Digitação
    const out = $("#serp-query");
    if (!out) return;
    if (RM) { out.textContent = phrases[0]; return; }
    let pi = 0;
    const type = (str, i, del) => {
      out.textContent = str.slice(0, i);
      let delay = del ? 26 : 55;
      if (!del && i === str.length) { delay = 2200; }
      else if (del && i === 0) { delay = 300; pi = (pi + 1) % phrases.length; }
      setTimeout(() => {
        const s = phrases[pi];
        if (!del && i < s.length) return type(s, i + 1, false);
        if (!del && i === s.length) return type(s, i - 1, true);
        if (del && i > 0) return type(s, i - 1, true);
        type(phrases[pi], 0, false);
      }, delay);
    };
    setTimeout(() => type(phrases[0], 0, false), 900);
  }

  /* ---------- 8. Máscara de telefone ---------- */
  const phoneInput = $("#f-whats");
  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      let d = phoneInput.value.replace(/\D/g, "").slice(0, 11);
      if (d.length > 6) d = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
      else if (d.length > 2) d = `(${d.slice(0, 2)}) ${d.slice(2)}`;
      else if (d.length > 0) d = `(${d}`;
      phoneInput.value = d;
    });
  }

  /* ---------- 9. Formulário → WhatsApp / E-mail ---------- */
  const form = $("#form-contato");
  const success = $(".form-success");

  const validate = data => {
    let ok = true;
    const mark = (name, valid) => {
      const input = form.querySelector(`[name="${name}"]`);
      input.closest(".field").classList.toggle("invalid", !valid);
      if (!valid && ok) { input.focus(); ok = false; }
      return valid;
    };
    mark("nome", data.nome.trim().length >= 2);
    mark("email", /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim()));
    mark("whats", data.whats.replace(/\D/g, "").length >= 10);
    mark("servico", data.servico !== "");
    return ok;
  };

  const buildMessage = d =>
    `Olá, vim pelo site e quero um orçamento.\n\n` +
    `*Nome:* ${d.nome}\n*E-mail:* ${d.email}\n*WhatsApp:* ${d.whats}\n*Serviço:* ${d.servico}` +
    (d.mensagem ? `\n*Mensagem:* ${d.mensagem}` : "");

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      if (data.empresa_hp) return; // honeypot: bot
      if (!validate(data)) return;

      const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(buildMessage(data))}`;
      $("#wa-fallback").href = url;
      window.open(url, "_blank", "noopener");
      form.hidden = true;
      success.hidden = false;
    });

    $("#enviar-email").addEventListener("click", () => {
      const data = Object.fromEntries(new FormData(form));
      if (!validate(data)) return;
      const body = encodeURIComponent(buildMessage(data).replace(/\*/g, ""));
      window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Orçamento — Site Raio Local")}&body=${body}`;
    });
  }

  /* ---------- 10. Mapa carregado sob demanda (Core Web Vitals) ---------- */
  const mapShell = $("#map-shell");
  if (mapShell) {
    $(".map-poster", mapShell).addEventListener("click", () => {
      const iframe = document.createElement("iframe");
      iframe.src = mapShell.dataset.src;
      iframe.title = "Mapa — Raio Local em João Pessoa, PB";
      iframe.loading = "lazy";
      iframe.allowFullscreen = true;
      mapShell.appendChild(iframe);
    }, { once: true });
  }

  /* ---------- 11. Fallback para imagens ausentes ---------- */
  const FALLBACK =
    "data:image/svg+xml," + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="680" height="860">
         <rect width="100%" height="100%" fill="#131519"/>
         <path d="M356 330 296 410h56l-18 92 60-80h-56l18-92z" fill="#FF5A1F"/>
         <text x="340" y="560" fill="#A3A7AD" font-family="monospace" font-size="18"
               text-anchor="middle">Imagem do case — images/</text>
       </svg>`
    );
  $$("img").forEach(img => {
    img.addEventListener("error", () => { img.src = FALLBACK; }, { once: true });
  });

  /* ---------- 12. Ano no rodapé ---------- */
  const ano = $("#ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();