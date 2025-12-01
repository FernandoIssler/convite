// Configurações básicas para você personalizar facilmente
const CONFIG = {
  graduateName: "Fernando Issler Silva",
  course: "Gestão da Tecnologia da Informação",
  eventDateTime: "2025-12-14T15:00:00", // 14 de dezembro de 2025 às 15:00h
  dateLabel: "14/12/2025",
  timeLabel: "15h00",
  place: "UNIAENE - Centro Universitário Adventista de Ensino do Nordeste",
  googleMapsUrl: "https://maps.app.goo.gl/LGx7Zg5ojuGZDxmC8", // Link do Google Maps
  uberUrl: "https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=BR%20101%2C%20Km%20197%2C%20Cachoeira%20-%20BA", // Link do Uber
  photoSrc: "./foto.jpg", // Altere para o nome do arquivo da sua foto
  photoAlt: "Foto de Fernando Issler Silva, formando em Gestão da Tecnologia da Informação",
};

// --- Fundo tipo "Matrix" --- //
function initMatrixBackground() {
  const canvas = document.getElementById("matrix-bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
  }

  resize();
  window.addEventListener("resize", resize);

  const columns = Math.floor(canvas.width / 18);
  const drops = Array(columns).fill(0);
  const speeds = Array.from({ length: columns }, () => 0.4 + Math.random() * 0.4); // mais lento
  const chars = "01";

  function draw() {
    // fundo mais escuro e trail mais forte para deixar as letras bem no fundo
    ctx.fillStyle = "rgba(1, 6, 18, 0.35)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // cor verde e mais transparente (efeito bem de segundo plano)
    ctx.fillStyle = "#22c55e";
    ctx.globalAlpha = 0.4;
    ctx.font = `14px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      const x = i * 18;
      const y = drops[i] * 16;

      ctx.fillText(text, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i] += speeds[i];
    }

    ctx.globalAlpha = 1;

    requestAnimationFrame(draw);
  }

  draw();
}

// --- Preencher textos com base na CONFIG --- //
function applyConfig() {
  const {
    graduateName,
    course,
    dateLabel,
    timeLabel,
    place,
    googleMapsUrl,
    uberUrl,
    photoSrc,
    photoAlt,
  } = CONFIG;

  const heroName = document.getElementById("hero-name");
  const heroDate = document.getElementById("hero-date");
  const heroPlace = document.getElementById("hero-place");
  const cardName = document.getElementById("card-name");
  const detailDate = document.getElementById("detail-date");
  const detailTime = document.getElementById("detail-time");
  const detailPlace = document.getElementById("detail-place");
  const inviteSnippet = document.getElementById("invite-snippet");
  const btnMaps = document.getElementById("btn-google-maps");
  const btnUber = document.getElementById("btn-uber");
  const heroPhotoImg = document.getElementById("hero-photo-img");

  if (heroName) heroName.textContent = `${graduateName}, ${course}`;
  if (cardName) cardName.textContent = graduateName;
  if (heroDate) heroDate.textContent = dateLabel;
  if (detailDate) detailDate.textContent = dateLabel;
  if (detailTime) detailTime.textContent = timeLabel;
  if (heroPlace) heroPlace.textContent = place;
  if (detailPlace) detailPlace.textContent = place;

  if (heroPhotoImg && photoSrc) {
    heroPhotoImg.src = photoSrc;
    if (photoAlt) {
      heroPhotoImg.alt = photoAlt;
    }
  }

  if (inviteSnippet) {
    inviteSnippet.textContent = `{
  "graduate": "${graduateName}",
  "course": "${course}",
  "event": {
    "type": "Cerimônia de formatura",
    "date": "${CONFIG.eventDateTime}",
    "place": "${place}"
  },
  "guest": "Você",
  "action": "Confirmar presença e celebrar comigo 🎓"
}`;
  }

  if (btnMaps && googleMapsUrl && googleMapsUrl !== "#") {
    btnMaps.href = googleMapsUrl;
  }
  if (btnUber && uberUrl && uberUrl !== "#") {
    btnUber.href = uberUrl;
  }
}

// --- Contagem regressiva --- //
function initCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;

  const target = new Date(CONFIG.eventDateTime).getTime();
  if (Number.isNaN(target)) {
    el.textContent = "Defina a data no código";
    return;
  }

  function update() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      el.textContent = "Chegou o grande dia! 🎓";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    el.textContent = `${String(days).padStart(2, "0")}d · ${String(hours).padStart(
      2,
      "0"
    )}h · ${String(minutes).padStart(2, "0")}m · ${String(seconds).padStart(2, "0")}s`;
  }

  update();
  setInterval(update, 1000);
}

// --- RSVP interativo --- //
function initRsvp() {
  const toggle = document.getElementById("attendance-toggle");
  const hiddenInput = document.getElementById("attendance");
  const form = document.getElementById("rsvp-form");
  const preview = document.getElementById("preview-message");
  const copyBtn = document.getElementById("btn-copy");
  const copyHint = document.getElementById("copy-hint");
  const submitBtn = form?.querySelector('button[type="submit"]');
  const feedbackMessage = document.getElementById("rsvp-feedback");

  if (!toggle || !hiddenInput || !form || !preview) return;

  // Alternar "Sim" / "Não"
  toggle.addEventListener("click", (event) => {
    const btn = event.target.closest(".pill-toggle__option");
    if (!btn) return;

    const value = btn.dataset.value;
    hiddenInput.value = value;

    toggle.querySelectorAll(".pill-toggle__option").forEach((el) => {
      el.classList.toggle("is-active", el === btn);
    });
  });

  function buildMessage(guestName, companions, attendance, message) {
    const nameValue = guestName?.trim() || "[Nome do convidado]";
    const companionsValue = parseInt(companions) || 0;
    const totalPeople = 1 + companionsValue; // Pessoa + acompanhantes
    const attendanceValue = attendance === "nao" ? "não poderei ir" : "confirmo minha presença";
    const customMessage = message?.trim() || "(sua mensagem aparecerá aqui)";

    let companionsText = "";
    if (companionsValue === 0) {
      companionsText = "Acompanhantes: 0 (apenas eu)";
    } else if (companionsValue === 1) {
      companionsText = `Acompanhantes: 1 (total: ${totalPeople} pessoas)`;
    } else {
      companionsText = `Acompanhantes: ${companionsValue} (total: ${totalPeople} pessoas)`;
    }

    return `Olá, ${CONFIG.graduateName}! ✅

Eu, ${nameValue}, ${attendanceValue} na sua formatura de ${CONFIG.course}! 🎓

${companionsText}

Mensagem: ${customMessage}`;
  }

  function showFeedback(message, isSuccess = true) {
    if (!feedbackMessage) return;
    
    feedbackMessage.textContent = message;
    feedbackMessage.className = `rsvp-feedback ${isSuccess ? 'rsvp-feedback--success' : 'rsvp-feedback--error'}`;
    feedbackMessage.style.display = 'block';
    
    // Scroll para o feedback
    feedbackMessage.scrollIntoView({ behavior: "smooth", block: "center" });
    
    // Esconder após 5 segundos
    setTimeout(() => {
      feedbackMessage.style.display = 'none';
    }, 5000);
  }

  // Enviar confirmação para a API
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const guestName = /** @type {HTMLInputElement|null} */ (
      document.getElementById("guest-name")
    );
    const companions = /** @type {HTMLInputElement|null} */ (
      document.getElementById("guest-companions")
    );
    const msg = /** @type {HTMLTextAreaElement|null} */ (
      document.getElementById("guest-message")
    );

    const nameValue = guestName?.value?.trim() || "";
    const companionsValue = parseInt(companions?.value || "0");
    const attendanceValue = hiddenInput.value;
    const messageValue = msg?.value?.trim() || "";

    // Validação
    if (!nameValue) {
      showFeedback("Por favor, preencha seu nome.", false);
      guestName?.focus();
      return;
    }

    // Desabilitar botão durante o envio
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";
    }

    try {
      // Enviar para a API PHP
      const response = await fetch('./api/rsvp.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestName: nameValue,
          companions: companionsValue,
          attendance: attendanceValue,
          message: messageValue || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showFeedback(data.message, true);
        
        // Atualizar preview
        preview.textContent = buildMessage(nameValue, companionsValue, attendanceValue, messageValue);
        
        // Limpar formulário após sucesso
        setTimeout(() => {
          form.reset();
          hiddenInput.value = 'sim';
          toggle.querySelectorAll(".pill-toggle__option").forEach((el, idx) => {
            el.classList.toggle("is-active", idx === 0);
          });
        }, 2000);
      } else {
        showFeedback(data.error || "Erro ao processar confirmação.", false);
      }
    } catch (error) {
      // Se não conseguir conectar à API, ainda mostra a mensagem gerada
      console.warn('Servidor não disponível, mostrando apenas preview:', error);
      preview.textContent = buildMessage(nameValue, companionsValue, attendanceValue, messageValue);
      showFeedback("Servidor offline. Mensagem gerada para você copiar e enviar manualmente.", false);
    } finally {
      // Reabilitar botão
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Confirmar presença";
      }
    }
  });

  // Copiar mensagem
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(preview.textContent || "");
        if (copyHint) {
          copyHint.textContent = "Mensagem copiada! Agora é só colar no WhatsApp ou e-mail.";
          setTimeout(() => {
            copyHint.textContent = "Clique para copiar o texto gerado.";
          }, 3000);
        }
      } catch {
        if (copyHint) {
          copyHint.textContent =
            "Não foi possível copiar automaticamente, mas você pode selecionar o texto manualmente.";
        }
      }
    });
  }
}

// --- Scroll suave para âncoras --- //
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// --- Inicialização geral --- //
document.addEventListener("DOMContentLoaded", () => {
  initMatrixBackground();
  applyConfig();
  initCountdown();
  initRsvp();
  initSmoothScroll();
});


