/**
 * Epifanía Belleza - Chatbot Asistente Virtual
 * Desarrollado para atención al cliente, consulta de precios, disponibilidad y agendamiento de citas
 */

(function () {
  // Datos de servicios con precios y tiempos estimados de sesión de manos
  const SERVICES_DATA = {
    semipermanente: {
      name: "Esmaltado Semipermanente",
      price: 18000,
      duration: "45 a 60 minutos",
      duration_minutes: 60,
      desc: "Manicura rusa, preparación de cutículas y esmaltado de alta duración con brillo sellador."
    },
    kapping: {
      name: "Kapping Gel (Refuerzo)",
      price: 23000,
      duration: "60 a 75 minutos",
      duration_minutes: 75,
      desc: "Capa protectora de gel nivelador sobre uña natural para evitar roturas o descamaciones."
    },
    esculpidas: {
      name: "Uñas Esculpidas / Soft Gel",
      price: 28000,
      duration: "90 a 120 minutos",
      duration_minutes: 120,
      desc: "Extensión y modelado con tips Soft Gel o acrílico para un largo y forma impecables."
    },
    nailart: {
      name: "Nail Art Exclusivo",
      price: 25000,
      duration: "75 a 90 minutos",
      duration_minutes: 90,
      desc: "Diseños a mano alzada, francesitas decoradas, efectos cromados o pedrería fina."
    }
  };

  // Clave de almacenamiento de citas en LocalStorage
  const APPOINTMENTS_STORAGE_KEY = "EPIFANIA_CITAS_AGENDADAS_V1";

  function getStoredAppointments() {
    try {
      const data = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveAppointment(appointment) {
    const list = getStoredAppointments();
    list.unshift(appointment);
    try {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent("epifania:appointment-added", { detail: appointment }));
    } catch (e) {
      console.warn("Error guardando cita localmente", e);
    }
  }

  // Esperar a que el DOM esté listo
  document.addEventListener("DOMContentLoaded", () => {
    const business = window.EpifaniaDB ? EpifaniaDB.getBusiness() : {
      name: "Epifanía Belleza",
      whatsapp: "280 496-8223",
      whatsapp_raw: "5492804968223",
      logo: "assets/img/logo.png"
    };

    // Crear elementos del Chatbot en el DOM
    createChatbotMarkup(business);
  });

  function createChatbotMarkup(business) {
    // 1. Botón Flotante
    const triggerBtn = document.createElement("button");
    triggerBtn.id = "floatingChatbotBtn";
    triggerBtn.className = "floating-chatbot-btn btn-touch";
    triggerBtn.setAttribute("aria-label", "Abrir Asistente Virtual");
    triggerBtn.innerHTML = `
      <div class="chatbot-avatar-ring">
        <img src="${business.logo || 'assets/img/logo.png'}" alt="Asistente">
        <span class="chatbot-online-dot"></span>
      </div>
      <div class="chatbot-btn-text">
        <span class="chatbot-btn-title">Asistente Virtual</span>
        <span class="chatbot-btn-sub">Turnos & Precios</span>
      </div>
    `;

    // 2. Ventana de Chat
    const chatWindow = document.createElement("div");
    chatWindow.id = "chatbotWindow";
    chatWindow.className = "chatbot-window";
    chatWindow.setAttribute("role", "dialog");
    chatWindow.setAttribute("aria-label", "Chat de Asistente Virtual");
    chatWindow.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-info">
          <img src="${business.logo || 'assets/img/logo.png'}" alt="Epifanía" class="chat-header-avatar">
          <div>
            <div class="chat-header-name">Epifanía Belleza</div>
            <div class="chat-header-status">En línea • Puerto Madryn, Chubut</div>
          </div>
        </div>
        <button class="chat-close-btn" id="closeChatbotBtn" aria-label="Cerrar chat">✕</button>
      </div>
      <div class="chat-messages-area" id="chatMessagesArea"></div>
    `;

    document.body.appendChild(triggerBtn);
    document.body.appendChild(chatWindow);

    // Eventos de apertura / cierre
    triggerBtn.addEventListener("click", () => {
      chatWindow.classList.toggle("active");
      if (chatWindow.classList.contains("active")) {
        const area = document.getElementById("chatMessagesArea");
        if (area.children.length === 0) {
          startChatFlow(business);
        }
      }
    });

    const closeBtn = document.getElementById("closeChatbotBtn");
    closeBtn.addEventListener("click", () => {
      chatWindow.classList.remove("active");
    });
  }

  // Iniciar flujo del Chatbot con el saludo cordial y las 3 opciones
  function startChatFlow(business) {
    const area = document.getElementById("chatMessagesArea");
    area.innerHTML = "";

    showBotMessage(
      `¡Hola! 🌸 Qué lindo tenerte por aquí. Te damos una muy cordial bienvenida a <strong>${business.name}</strong> en Puerto Madryn, Chubut.
      <br><br>
      Soy tu asistente virtual y estoy para ayudarte a lucir tus manos impecables. ¿En qué te puedo asesorar hoy?`,
      () => {
        showMainOptions();
      }
    );
  }

  // Opciones Principales del Chatbot
  function showMainOptions() {
    const optionsGroup = document.createElement("div");
    optionsGroup.className = "chat-options-group";
    optionsGroup.innerHTML = `
      <button class="chat-option-btn" data-action="precios">
        <span>💅 1. Consultar precios</span>
        <span>→</span>
      </button>
      <button class="chat-option-btn" data-action="disponibilidad">
        <span>🕒 2. Consultar por disponibilidad</span>
        <span>→</span>
      </button>
      <button class="chat-option-btn" data-action="reserva">
        <span>📅 3. Hacer una reserva</span>
        <span>→</span>
      </button>
    `;

    optionsGroup.querySelectorAll(".chat-option-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const action = btn.dataset.action;
        optionsGroup.remove();

        if (action === "precios") {
          showUserMessage("Consultar precios");
          handleOptionPrecios();
        } else if (action === "disponibilidad") {
          showUserMessage("Consultar por disponibilidad");
          handleOptionDisponibilidad();
        } else if (action === "reserva") {
          showUserMessage("Hacer una reserva");
          handleOptionReserva();
        }
      });
    });

    const area = document.getElementById("chatMessagesArea");
    area.appendChild(optionsGroup);
    scrollToBottom();
  }

  // OPCIÓN 1: Consultar Precios y Tiempo que lleva el servicio
  function handleOptionPrecios() {
    showTypingIndicator(() => {
      const htmlContent = `
        Aquí tenés el detalle completo de nuestros servicios de manicura, los precios vigentes y el tiempo estimado que lleva cada sesión:
        
        <div class="chat-info-card">
          <div class="chat-price-item">
            <div>
              <strong>💅 Semipermanente</strong><br>
              <span class="chat-price-time">⏱️ Tiempo: ${SERVICES_DATA.semipermanente.duration}</span>
            </div>
            <strong style="color: var(--color-primary-dark); font-size: 0.95rem;">$18.000</strong>
          </div>

          <div class="chat-price-item">
            <div>
              <strong>🛡️ Kapping Gel</strong><br>
              <span class="chat-price-time">⏱️ Tiempo: ${SERVICES_DATA.kapping.duration}</span>
            </div>
            <strong style="color: var(--color-primary-dark); font-size: 0.95rem;">$23.000</strong>
          </div>

          <div class="chat-price-item">
            <div>
              <strong>💎 Uñas Esculpidas / Soft Gel</strong><br>
              <span class="chat-price-time">⏱️ Tiempo: ${SERVICES_DATA.esculpidas.duration}</span>
            </div>
            <strong style="color: var(--color-primary-dark); font-size: 0.95rem;">$28.000</strong>
          </div>

          <div class="chat-price-item">
            <div>
              <strong>🎨 Nail Art Exclusivo</strong><br>
              <span class="chat-price-time">⏱️ Tiempo: ${SERVICES_DATA.nailart.duration}</span>
            </div>
            <strong style="color: var(--color-primary-dark); font-size: 0.95rem;">$25.000</strong>
          </div>
        </div>

        Todos nuestros trabajos incluyen manicura rusa combinada, esterilización de instrumental y productos de máxima calidad. ¿Qué te gustaría hacer a continuación?
      `;

      showBotMessage(htmlContent, () => {
        const nextGroup = document.createElement("div");
        nextGroup.className = "chat-options-group";
        nextGroup.innerHTML = `
          <button class="chat-option-btn" data-action="reserva">
            <span>📅 Hacer una reserva ahora</span>
            <span>→</span>
          </button>
          <button class="chat-option-btn" data-action="disponibilidad">
            <span>🕒 Consultar por disponibilidad</span>
            <span>→</span>
          </button>
          <button class="chat-option-btn" data-action="menu">
            <span>↩️ Volver al menú principal</span>
            <span>↺</span>
          </button>
        `;

        nextGroup.querySelectorAll(".chat-option-btn").forEach(b => {
          b.addEventListener("click", () => {
            const act = b.dataset.action;
            nextGroup.remove();
            if (act === "reserva") {
              showUserMessage("Hacer una reserva");
              handleOptionReserva();
            } else if (act === "disponibilidad") {
              showUserMessage("Consultar por disponibilidad");
              handleOptionDisponibilidad();
            } else {
              showUserMessage("Volver al menú");
              showMainOptions();
            }
          });
        });

        document.getElementById("chatMessagesArea").appendChild(nextGroup);
        scrollToBottom();
      });
    });
  }

  // OPCIÓN 2: Consultar Disponibilidad y dar opción de agendar cita
  function handleOptionDisponibilidad() {
    showTypingIndicator(() => {
      const htmlContent = `
        Atendemos en nuestro estudio en <strong>Puerto Madryn, Chubut</strong> en los siguientes días y horarios:
        <br><br>
        📅 <strong>Lunes a Viernes:</strong> 09:00 hs a 20:00 hs (Horario corrido)<br>
        📅 <strong>Sábados:</strong> 09:00 hs a 15:00 hs<br>
        🚫 <strong>Domingos:</strong> Cerrado
        <br><br>
        ✨ <em>¡Contamos con turnos disponibles para esta semana en Puerto Madryn, Chubut!</em>
      `;

      showBotMessage(htmlContent, () => {
        const nextGroup = document.createElement("div");
        nextGroup.className = "chat-options-group";
        nextGroup.innerHTML = `
          <button class="chat-option-btn" data-action="agendar" style="background: #FFF5F2; border-color: var(--color-primary);">
            <span>📅 Agendar Cita Ahora</span>
            <span>✨</span>
          </button>
          <button class="chat-option-btn" data-action="precios">
            <span>💅 Ver precios y tiempos</span>
            <span>→</span>
          </button>
          <button class="chat-option-btn" data-action="menu">
            <span>↩️ Volver al menú principal</span>
            <span>↺</span>
          </button>
        `;

        nextGroup.querySelectorAll(".chat-option-btn").forEach(b => {
          b.addEventListener("click", () => {
            const act = b.dataset.action;
            nextGroup.remove();
            if (act === "agendar") {
              showUserMessage("Agendar Cita");
              handleOptionReserva();
            } else if (act === "precios") {
              showUserMessage("Consultar precios");
              handleOptionPrecios();
            } else {
              showUserMessage("Volver al menú");
              showMainOptions();
            }
          });
        });

        document.getElementById("chatMessagesArea").appendChild(nextGroup);
        scrollToBottom();
      });
    });
  }

  // OPCIÓN 3: Panel de Reserva (Nombre, Teléfono, Trabajo a Realizar, Tipo de Pago)
  function handleOptionReserva() {
    showTypingIndicator(() => {
      showBotMessage(
        "¡Excelente decisión! Por favor completá tus datos en el siguiente panel para agendar tu cita:",
        () => {
          renderBookingForm();
        }
      );
    });
  }

  // Formulario interactivo embebido para la Opción 3
  function renderBookingForm() {
    const area = document.getElementById("chatMessagesArea");
    const formContainer = document.createElement("div");
    formContainer.className = "chat-booking-form";
    formContainer.innerHTML = `
      <div class="chat-form-title">📋 Panel de Reserva de Cita</div>
      
      <div>
        <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-main);">Nombre y Apellido</label>
        <input type="text" id="chatFormName" class="chat-input" placeholder="Ej: Valentina Morales" required>
      </div>

      <div>
        <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-main);">Teléfono de Contacto</label>
        <input type="tel" id="chatFormPhone" class="chat-input" placeholder="Ej: 280 412-3456" required>
      </div>

      <div>
        <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-main);">Trabajo a Realizar</label>
        <select id="chatFormService" class="chat-select" required>
          <option value="semipermanente">Semipermanente ($18.000 - 60 min)</option>
          <option value="kapping">Kapping Gel ($23.000 - 75 min)</option>
          <option value="esculpidas">Uñas Esculpidas ($28.000 - 120 min)</option>
          <option value="nailart">Nail Art Exclusivo ($25.000 - 90 min)</option>
        </select>
      </div>

      <div>
        <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-main);">Tipo de Pago</label>
        <select id="chatFormPayment" class="chat-select" required>
          <option value="Efectivo">Efectivo en el local</option>
          <option value="Transferencia / Alias">Transferencia Bancaria / Alias</option>
          <option value="MercadoPago / QR">MercadoPago / QR / Débito</option>
        </select>
      </div>

      <div>
        <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-main);">Día u Horario Preferido</label>
        <input type="text" id="chatFormSchedule" class="chat-input" placeholder="Ej: Este Jueves a las 16:00 hs">
      </div>

      <button type="button" id="btnSubmitChatBooking" class="btn-confirm-chat-booking">
        <span>✨ Confirmar Cita</span>
      </button>
    `;

    area.appendChild(formContainer);
    scrollToBottom();

    // Evento de confirmación del formulario
    const submitBtn = formContainer.querySelector("#btnSubmitChatBooking");
    submitBtn.addEventListener("click", () => {
      const name = formContainer.querySelector("#chatFormName").value.trim();
      const phone = formContainer.querySelector("#chatFormPhone").value.trim();
      const serviceKey = formContainer.querySelector("#chatFormService").value;
      const payment = formContainer.querySelector("#chatFormPayment").value;
      const schedule = formContainer.querySelector("#chatFormSchedule").value.trim() || "A coordinar";

      if (!name || !phone) {
        alert("Por favor completá tu Nombre, Apellido y Teléfono para agendar.");
        return;
      }

      const serviceInfo = SERVICES_DATA[serviceKey];
      const appointmentData = {
        id: `cita-${Date.now()}`,
        cliente_nombre: name,
        cliente_telefono: phone,
        servicio_key: serviceKey,
        servicio_nombre: serviceInfo.name,
        precio: serviceInfo.price,
        duracion_estimada: serviceInfo.duration,
        duracion_minutos: serviceInfo.duration_minutes,
        tipo_pago: payment,
        horario_preferido: schedule,
        fecha_creacion: new Date().toISOString()
      };

      // Guardar cita en LocalStorage para el panel /admin
      saveAppointment(appointmentData);

      // Deshabilitar formulario completado
      formContainer.style.opacity = "0.75";
      formContainer.style.pointerEvents = "none";

      // Mostrar confirmación en el chat
      showUserMessage(`Quiero reservar para ${serviceInfo.name}`);
      showBookingConfirmation(appointmentData);
    });
  }

  // Mostrar resultado: "Cita Agendada" y Tiempo Estimado de Sesión
  function showBookingConfirmation(data) {
    showTypingIndicator(() => {
      const business = window.EpifaniaDB ? EpifaniaDB.getBusiness() : {
        whatsapp_raw: "5492804968223"
      };

      const waText = encodeURIComponent(
        `¡Hola Epifanía Belleza! Acabo de agendar una cita desde el asistente web:\n` +
        `📍 Estudio: Puerto Madryn, Chubut\n` +
        `• Nombre: ${data.cliente_nombre}\n` +
        `• Teléfono: ${data.cliente_telefono}\n` +
        `• Servicio: ${data.servicio_nombre} ($${data.precio.toLocaleString('es-AR')})\n` +
        `• Tiempo estimado de sesión: ${data.duracion_estimada}\n` +
        `• Tipo de pago: ${data.tipo_pago}\n` +
        `• Horario solicitado: ${data.horario_preferido}\n` +
        `¿Me confirmás el turno? ¡Muchas gracias!`
      );
      const waLink = `https://wa.me/${business.whatsapp_raw}?text=${waText}`;

      const card = document.createElement("div");
      card.className = "booking-confirmed-card";
      card.innerHTML = `
        <div class="booking-confirmed-header">
          <span>✅</span>
          <span>¡CITA AGENDADA!</span>
        </div>
        <p style="font-size: 0.85rem; color: #166534; line-height: 1.4;">
          Muchas gracias <strong>${data.cliente_nombre}</strong>. Tu turno para <strong>${data.servicio_nombre}</strong> ha quedado registrado para nuestro estudio en <strong>Puerto Madryn, Chubut</strong>.
        </p>

        <div class="booking-duration-badge">
          <span>⏱️</span>
          <span><strong>Tiempo estimado de la sesión de manos:</strong> ${data.duracion_estimada}</span>
        </div>

        <div style="font-size: 0.8rem; color: #374151; background: #FFFFFF; padding: 0.65rem; border-radius: 8px; border: 1px solid #E5E7EB; line-height: 1.5;">
          <div>📍 <strong>Ubicación:</strong> Puerto Madryn, Chubut</div>
          <div>💰 <strong>Precio:</strong> $${data.precio.toLocaleString('es-AR')}</div>
          <div>💳 <strong>Tipo de pago:</strong> ${data.tipo_pago}</div>
          <div>🕒 <strong>Horario solicitado:</strong> ${data.horario_preferido}</div>
        </div>

        <a href="${waLink}" target="_blank" rel="noopener" class="btn-wa-confirm-send btn-touch">
          <span>💬 Enviar confirmación a WhatsApp</span>
        </a>

        <button class="chat-option-btn" id="btnChatReset" style="margin-top: 0.4rem; justify-content: center; font-size: 0.78rem;">
          <span>↩️ Volver al menú principal</span>
        </button>
      `;

      card.querySelector("#btnChatReset").addEventListener("click", () => {
        showUserMessage("Volver al menú");
        showMainOptions();
      });

      const area = document.getElementById("chatMessagesArea");
      area.appendChild(card);
      scrollToBottom();
    });
  }

  // Utilitarios de Mensajería Visual
  function showBotMessage(htmlContent, callback) {
    const area = document.getElementById("chatMessagesArea");
    const msg = document.createElement("div");
    msg.className = "chat-message bot";
    msg.innerHTML = `
      <img src="assets/img/logo.png" alt="Epifanía" class="chat-bubble-avatar">
      <div class="chat-bubble">${htmlContent}</div>
    `;
    area.appendChild(msg);
    scrollToBottom();
    if (callback) callback();
  }

  function showUserMessage(text) {
    const area = document.getElementById("chatMessagesArea");
    const msg = document.createElement("div");
    msg.className = "chat-message user";
    msg.innerHTML = `
      <div class="chat-bubble">${text}</div>
    `;
    area.appendChild(msg);
    scrollToBottom();
  }

  function showTypingIndicator(callback) {
    const area = document.getElementById("chatMessagesArea");
    const typing = document.createElement("div");
    typing.className = "chat-message bot";
    typing.id = "typingIndicator";
    typing.innerHTML = `
      <img src="assets/img/logo.png" alt="Epifanía" class="chat-bubble-avatar">
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    area.appendChild(typing);
    scrollToBottom();

    setTimeout(() => {
      const el = document.getElementById("typingIndicator");
      if (el) el.remove();
      if (callback) callback();
    }, 600);
  }

  function scrollToBottom() {
    const area = document.getElementById("chatMessagesArea");
    if (area) {
      area.scrollTop = area.scrollHeight;
    }
  }

  // Exportar al ámbito global para integración con /admin
  window.EpifaniaAppointments = {
    getAppointments: getStoredAppointments,
    saveAppointment: saveAppointment,
    clearAppointments: function() {
      localStorage.removeItem(APPOINTMENTS_STORAGE_KEY);
    }
  };
})();
