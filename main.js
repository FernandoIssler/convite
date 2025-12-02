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
  const eventCeremony = /** @type {HTMLInputElement|null} */(document.getElementById("event-ceremony"));
  const eventCulto = /** @type {HTMLInputElement|null} */(document.getElementById("event-culto"));

  if (!toggle || !hiddenInput || !form) return;

  // Alternar "Sim" / "Não"
  toggle.addEventListener("click", (event) => {
    const btn = event.target.closest(".pill-toggle__option");
    if (!btn) return;

    const value = btn.dataset.value;
    hiddenInput.value = value;

    toggle.querySelectorAll(".pill-toggle__option").forEach((el) => {
      el.classList.toggle("is-active", el === btn);
    });

    // Habilitar/desabilitar seleção de eventos conforme presença
    const going = value === 'sim';
    if (eventCeremony) {
      eventCeremony.disabled = !going;
      if (!going) eventCeremony.checked = false;
    }
    if (eventCulto) {
      eventCulto.disabled = !going;
      if (!going) eventCulto.checked = false;
    }
  });

  function buildMessage(guestName, companions, attendance, message, evCeremony, evCulto) {
    const nameValue = guestName?.trim() || "[Nome do convidado]";
    const companionsValue = parseInt(companions) || 0;
    const totalPeople = 1 + companionsValue; // Pessoa + acompanhantes
    const attendanceValue = attendance === "nao" ? "não poderei ir" : "confirmo minha presença";
    const customMessage = message?.trim() || "(sua mensagem aparecerá aqui)";

    let eventosTexto = "";
    if (attendance !== 'nao') {
      const partes = [];
      if (evCeremony) partes.push('Cerimônia (14/12 15h)');
      if (evCulto) partes.push('Culto de gratidão (12/12 19h)');
      eventosTexto = partes.length ? `\n\nEventos: ${partes.join(' + ')}` : '';
    }

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
  ${eventosTexto}

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
    const attendCeremony = !!eventCeremony?.checked;
    const attendCulto = !!eventCulto?.checked;

    // Validação
    if (!nameValue) {
      showFeedback("Por favor, preencha seu nome.", false);
      guestName?.focus();
      return;
    }

    if (attendanceValue === 'sim' && !attendCeremony && !attendCulto) {
      showFeedback("Selecione ao menos um evento (Cerimônia e/ou Culto).", false);
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
          attendCeremony,
          attendCulto,
          message: messageValue || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showFeedback(data.message, true);

        // Atualizar preview (se existir)
        if (preview) {
          preview.textContent = buildMessage(nameValue, companionsValue, attendanceValue, messageValue, attendCeremony, attendCulto);
        }

        // Limpar formulário após sucesso
        setTimeout(() => {
          form.reset();
          hiddenInput.value = 'sim';
          toggle.querySelectorAll(".pill-toggle__option").forEach((el, idx) => {
            el.classList.toggle("is-active", idx === 0);
          });
          if (eventCeremony) { eventCeremony.disabled = false; eventCeremony.checked = false; }
          if (eventCulto) { eventCulto.disabled = false; eventCulto.checked = false; }
        }, 2000);
      } else {
        showFeedback(data.error || "Erro ao processar confirmação.", false);
      }
    } catch (error) {
      console.warn('Servidor não disponível, mostrando apenas preview:', error);
      if (preview) {
        preview.textContent = buildMessage(nameValue, companionsValue, attendanceValue, messageValue, attendCeremony, attendCulto);
      }
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

// --- Gerar código EMV do PIX --- //
function generatePixEmv(cpf, name, city = "BRASILIA") {
  // Remove caracteres não numéricos do CPF
  const cleanCpf = cpf.replace(/\D/g, "");

  // Limita o nome a 25 caracteres (padrão PIX)
  const merchantName = name.substring(0, 25).toUpperCase();
  const merchantCity = city.substring(0, 15).toUpperCase();

  // Monta os campos do payload EMV
  const payloadFormatIndicator = "000201"; // ID 00 + tamanho 02 + valor 01
  const merchantAccountInfo = "26" + String(14 + cleanCpf.length + 2).padStart(2, "0") + "0014br.gov.bcb.pix01" + String(cleanCpf.length).padStart(2, "0") + cleanCpf; // ID 26 + tamanho + GUI + tamanho chave + chave
  const merchantCategoryCode = "52040000"; // ID 52 + tamanho 04 + valor 0000
  const transactionCurrency = "5303986"; // ID 53 + tamanho 03 + valor 986 (BRL)
  const countryCode = "5802BR"; // ID 58 + tamanho 02 + valor BR
  const merchantNameField = "59" + String(merchantName.length).padStart(2, "0") + merchantName; // ID 59 + tamanho + nome
  const merchantCityField = "60" + String(merchantCity.length).padStart(2, "0") + merchantCity; // ID 60 + tamanho + cidade
  const additionalDataField = "62070503***"; // ID 62 + tamanho 07 + template 05 + tamanho 02 + referência ***

  // Monta o payload sem CRC
  const payloadWithoutCrc = payloadFormatIndicator + merchantAccountInfo + merchantCategoryCode +
    transactionCurrency + countryCode + merchantNameField + merchantCityField +
    additionalDataField;

  // Calcula CRC16 sobre o payload + campo 63 (sem o valor do CRC)
  const payloadForCrc = payloadWithoutCrc + "6304";
  const crc = calculateCRC16(payloadForCrc);
  return payloadForCrc + crc;
}

// --- Calcular CRC16 (CCITT-FALSE) --- //
function calculateCRC16(data) {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < data.length; i++) {
    const byte = data.charCodeAt(i);
    crc ^= (byte << 8);

    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = ((crc << 1) ^ polynomial) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// --- Inicializar PIX --- //
function initPix() {
  const qrCanvas = document.getElementById("pix-qrcode");
  const copyBtn = document.getElementById("btn-copy-pix");
  const copyHint = document.getElementById("pix-copy-hint");
  const pixKey = document.getElementById("pix-key");

  if (!qrCanvas || !copyBtn || !pixKey) return;

  const pixCpf = "02482451558";
  const pixName = CONFIG.graduateName || "Fernando Issler Silva";
  const pixCity = "Cachoeira";

  // Gera o código EMV do PIX
  const pixEmv = generatePixEmv(pixCpf, pixName, pixCity);

  // Gera o QR code
  if (typeof QRCode !== "undefined") {
    QRCode.toCanvas(qrCanvas, pixEmv, {
      width: 250,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    }, (error) => {
      if (error) {
        console.error("Erro ao gerar QR code:", error);
      }
    });
  }

  // Copiar chave PIX
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(pixCpf);
        if (copyHint) {
          copyHint.textContent = "Chave PIX copiada! Agora é só colar no app do seu banco.";
          copyHint.classList.add("copied");
          setTimeout(() => {
            copyHint.textContent = "Clique no ícone para copiar a chave PIX";
            copyHint.classList.remove("copied");
          }, 3000);
        }
      } catch (err) {
        console.error("Erro ao copiar:", err);
        if (copyHint) {
          copyHint.textContent = "Não foi possível copiar automaticamente. Selecione o código manualmente.";
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
  initPix();
  initMemoryGame();
  initSmoothScroll();
});
// --- Mini-game memória para liberar o PIX --- //
function initMemoryGame() {
  const gameEl = document.getElementById('pix-game');
  const grid = document.getElementById('memory-grid');
  const resetBtn = document.getElementById('pix-game-reset');
  const hint = document.getElementById('memory-hint');
  const reveal = document.getElementById('pix-reveal');
  const donationText = document.getElementById('pix-donation-text');

  if (!gameEl || !grid || !resetBtn || !hint || !reveal) return;

  const symbols = ['🎓', '🥂', '📷', 'X', 'S2', 'Nando']; // 3 pairs
  let deck = [];
  let first = null;
  let second = null;
  let lock = false;
  let moves = 0;
  let matched = 0;

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function buildDeck() {
    deck = shuffle([...symbols, ...symbols]);
  }

  function render() {
    grid.innerHTML = '';
    deck.forEach((s, idx) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.symbol = s;
      card.dataset.index = String(idx);
      card.innerHTML = `
        <div class="memory-card__inner">
          <div class="memory-card__face front"></div>
          <div class="memory-card__face back">${s}</div>
        </div>`;
      card.addEventListener('click', onCardClick);
      grid.appendChild(card);
    });
    moves = 0;
    matched = 0;
    hint.textContent = `Jogadas: ${moves}`;
  }

  function onCardClick(e) {
    if (lock) return;
    const clicked = e.currentTarget;
    if (clicked.classList.contains('matched') || clicked.classList.contains('flipped')) return;
    clicked.classList.add('flipped');
    if (!first) {
      first = clicked;
      return;
    }
    second = clicked;
    lock = true;
    moves += 1;
    hint.textContent = `Jogadas: ${moves}`;

    const a = first.dataset.symbol;
    const b = second.dataset.symbol;

    if (a === b) {
      // match
      setTimeout(() => {
        first.classList.add('matched');
        second.classList.add('matched');
        first = null;
        second = null;
        lock = false;
        matched += 1;
        if (matched === symbols.length) {
          gameWin();
        }
      }, 350);
    } else {
      // not match
      setTimeout(() => {
        first.classList.remove('flipped');
        second.classList.remove('flipped');
        first = null;
        second = null;
        lock = false;
      }, 700);
    }
  }

  function gameWin() {
    // reveal PIX and donation text
    reveal.style.display = 'block';
    if (donationText) donationText.style.display = 'block';
    // show a small congrats message
    const msg = document.createElement('div');
    msg.style.textAlign = 'center';
    msg.style.marginTop = '8px';
    msg.style.color = '#22c55e';
    msg.textContent = 'Parabéns! Você desbloqueou a surpresa 🎉';
    gameEl.appendChild(msg);
    // disable further interaction
    grid.querySelectorAll('.memory-card').forEach(c => c.classList.add('matched'));
    // generate QR now (if initPix ran earlier it may have already created it)
    try { initPix(); } catch (e) {}
  }

  function start() {
    buildDeck();
    render();
  }

  resetBtn.addEventListener('click', () => {
    // remove any congrats message
    const existing = gameEl.querySelector('div');
    if (existing && existing.textContent && existing.textContent.includes('Parabéns')) existing.remove();
    first = second = null;
    lock = false;
    start();
  });

  // initial start
  start();
}


