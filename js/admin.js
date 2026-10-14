/**
 * Epifanía Belleza - Lógica del Panel de Administración
 * Desarrollado por ag-web-builder-04
 */

document.addEventListener("DOMContentLoaded", () => {
  // Estado de la sesión admin
  const AUTH_SESSION_KEY = "EPIFANIA_ADMIN_AUTH_ACTIVE";
  
  // Elementos de Seguridad
  const pinLockScreen = document.getElementById("pinLockScreen");
  const adminApp = document.getElementById("adminApp");
  const pinForm = document.getElementById("pinForm");
  const adminPinInput = document.getElementById("adminPinInput");
  const pinErrorMsg = document.getElementById("pinErrorMsg");
  const adminLogoutBtn = document.getElementById("adminLogoutBtn");

  // Elementos de Pestañas
  const tabButtons = document.querySelectorAll(".admin-tab-btn");
  const sectionCatalog = document.getElementById("sectionCatalog");
  const sectionStories = document.getElementById("sectionStories");
  const sectionAppointments = document.getElementById("sectionAppointments");
  const sectionSettings = document.getElementById("sectionSettings");
  const tabCountCatalog = document.getElementById("tabCountCatalog");
  const tabCountStories = document.getElementById("tabCountStories");
  const tabCountAppointments = document.getElementById("tabCountAppointments");
  const adminAppointmentsList = document.getElementById("adminAppointmentsList");
  const btnClearAllAppointments = document.getElementById("btnClearAllAppointments");

  // Elementos de Catálogo
  const adminCatalogGrid = document.getElementById("adminCatalogGrid");
  const adminSearchInput = document.getElementById("adminSearchInput");
  const adminCategorySelect = document.getElementById("adminCategorySelect");
  const btnOpenNewWorkModal = document.getElementById("btnOpenNewWorkModal");

  // Modal Trabajo
  const workModal = document.getElementById("workModal");
  const workModalTitle = document.getElementById("workModalTitle");
  const workForm = document.getElementById("workForm");
  const workIdInput = document.getElementById("workIdInput");
  const workTitleInput = document.getElementById("workTitleInput");
  const workCategoryInput = document.getElementById("workCategoryInput");
  const workPriceInput = document.getElementById("workPriceInput");
  const workDescInput = document.getElementById("workDescInput");
  const workImageUrlInput = document.getElementById("workImageUrlInput");
  const workFileInput = document.getElementById("workFileInput");
  const workDropzone = document.getElementById("workDropzone");
  const workPreviewBox = document.getElementById("workPreviewBox");
  const workPreviewImg = document.getElementById("workPreviewImg");
  const closeWorkModal = document.getElementById("closeWorkModal");
  const btnCancelWorkModal = document.getElementById("btnCancelWorkModal");

  // Elementos de Historias
  const adminStoriesGrid = document.getElementById("adminStoriesGrid");
  const btnOpenNewStoryModal = document.getElementById("btnOpenNewStoryModal");

  // Modal Historia
  const storyModal = document.getElementById("storyModal");
  const storyModalTitle = document.getElementById("storyModalTitle");
  const storyForm = document.getElementById("storyForm");
  const storyIdInput = document.getElementById("storyIdInput");
  const storyTitleInput = document.getElementById("storyTitleInput");
  const storyTagInput = document.getElementById("storyTagInput");
  const storyDescInput = document.getElementById("storyDescInput");
  const storyImageUrlInput = document.getElementById("storyImageUrlInput");
  const storyFileInput = document.getElementById("storyFileInput");
  const storyDropzone = document.getElementById("storyDropzone");
  const storyPreviewBox = document.getElementById("storyPreviewBox");
  const storyPreviewImg = document.getElementById("storyPreviewImg");
  const closeStoryModal = document.getElementById("closeStoryModal");
  const btnCancelStoryModal = document.getElementById("btnCancelStoryModal");

  // Configuración & Respaldo
  const businessSettingsForm = document.getElementById("businessSettingsForm");
  const settingBusinessName = document.getElementById("settingBusinessName");
  const settingWhatsapp = document.getElementById("settingWhatsapp");
  const settingInstagram = document.getElementById("settingInstagram");
  const settingLocation = document.getElementById("settingLocation");
  const settingScheduleWeek = document.getElementById("settingScheduleWeek");
  const settingScheduleSat = document.getElementById("settingScheduleSat");
  const changePinForm = document.getElementById("changePinForm");
  const newAdminPin = document.getElementById("newAdminPin");
  const btnExportBackup = document.getElementById("btnExportBackup");
  const fileImportBackup = document.getElementById("fileImportBackup");
  const btnResetDefaults = document.getElementById("btnResetDefaults");

  // 1. Control de Seguridad y Autenticación
  function checkAuth() {
    const isAuth = sessionStorage.getItem(AUTH_SESSION_KEY) === "true";
    if (isAuth) {
      pinLockScreen.style.display = "none";
      adminApp.style.display = "block";
      initAdminDashboard();
    } else {
      pinLockScreen.style.display = "flex";
      adminApp.style.display = "none";
      adminPinInput.value = "";
      adminPinInput.focus();
    }
  }

  pinForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const enteredPin = adminPinInput.value.trim();
    const currentPin = EpifaniaDB.getAdminPin();

    if (enteredPin === currentPin) {
      sessionStorage.setItem(AUTH_SESSION_KEY, "true");
      pinErrorMsg.style.display = "none";
      checkAuth();
    } else {
      pinErrorMsg.style.display = "block";
      adminPinInput.value = "";
      adminPinInput.focus();
    }
  });

  adminLogoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    checkAuth();
  });

  // 2. Inicialización del Dashboard
  function initAdminDashboard() {
    renderAdminCatalog();
    renderAdminStories();
    renderAdminAppointments();
    loadBusinessSettings();
    setupTabs();
    setupCatalogEventListeners();
    setupStoriesEventListeners();
    setupSettingsEventListeners();
    setupAppointmentsEventListeners();
  }

  // 3. Pestañas
  function setupTabs() {
    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const tab = btn.dataset.tab;
        sectionCatalog.style.display = tab === "catalog" ? "block" : "none";
        sectionStories.style.display = tab === "stories" ? "block" : "none";
        if (sectionAppointments) sectionAppointments.style.display = tab === "appointments" ? "block" : "none";
        sectionSettings.style.display = tab === "settings" ? "block" : "none";

        if (tab === "appointments") {
          renderAdminAppointments();
        }
      });
    });
  }

  // 4. Renderizado del Catálogo en Admin
  function renderAdminCatalog() {
    const catalog = EpifaniaDB.getCatalog();
    tabCountCatalog.textContent = catalog.length;

    const searchTerm = adminSearchInput.value.toLowerCase().trim();
    const selectedCat = adminCategorySelect.value;

    const filtered = catalog.filter(item => {
      const matchCat = (selectedCat === "todas") || (item.categoria === selectedCat);
      const matchSearch = (!searchTerm) || 
        (item.titulo.toLowerCase().includes(searchTerm)) || 
        (item.categoria_label.toLowerCase().includes(searchTerm)) ||
        (item.descripcion && item.descripcion.toLowerCase().includes(searchTerm));
      return matchCat && matchSearch;
    });

    adminCatalogGrid.innerHTML = "";

    if (filtered.length === 0) {
      adminCatalogGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--color-text-muted);">
          No se encontraron trabajos con los filtros actuales.
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "admin-item-card";
      
      const priceFormatted = EpifaniaDB.formatPrice(item.precio);

      const safeTitulo = escapeHtml(item.titulo);
      const safeCatLabel = escapeHtml(item.categoria_label);
      const safeDesc = escapeHtml(item.descripcion || "Sin descripción.");

      card.innerHTML = `
        <div class="admin-item-media">
          <img src="${item.imagen || item.archivo_optimizado}" alt="${safeTitulo}" loading="lazy">
          <span class="work-category-badge" style="top: 8px; left: 8px;">${safeCatLabel}</span>
        </div>
        <div class="admin-item-body">
          <h4 class="admin-item-title">${safeTitulo}</h4>
          <p style="font-size: 0.8rem; color: var(--color-text-muted); line-height: 1.35; flex-grow: 1;">
            ${safeDesc}
          </p>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.25rem;">
            <span style="font-size: 0.75rem; color: var(--color-text-light);">Precio:</span>
            <span class="admin-item-price-badge">${priceFormatted}</span>
          </div>
          <div class="admin-item-actions">
            <button class="btn-item-action btn-item-edit" data-edit-id="${item.id}">
              <span>✏️ Editar</span>
            </button>
            <button class="btn-item-action btn-item-delete" data-delete-id="${item.id}">
              <span>🗑️ Borrar</span>
            </button>
          </div>
        </div>
      `;

      // Eventos de Editar y Borrar
      card.querySelector("[data-edit-id]").addEventListener("click", () => openEditWorkModal(item.id));
      card.querySelector("[data-delete-id]").addEventListener("click", () => deleteWorkItem(item.id));

      adminCatalogGrid.appendChild(card);
    });
  }

  function setupCatalogEventListeners() {
    adminSearchInput.addEventListener("input", renderAdminCatalog);
    adminCategorySelect.addEventListener("change", renderAdminCatalog);

    btnOpenNewWorkModal.addEventListener("click", () => {
      openNewWorkModal();
    });

    closeWorkModal.addEventListener("click", () => workModal.classList.remove("active"));
    btnCancelWorkModal.addEventListener("click", () => workModal.classList.remove("active"));

    // Subida de imagen para trabajo
    workDropzone.addEventListener("click", () => workFileInput.click());
    workFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          workImageUrlInput.value = event.target.result;
          showWorkPreview(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    });

    workImageUrlInput.addEventListener("input", () => {
      showWorkPreview(workImageUrlInput.value);
    });

    // Guardar trabajo (Crear o Editar)
    workForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveWorkForm();
    });
  }

  function showWorkPreview(src) {
    if (src) {
      workPreviewImg.src = src;
      workPreviewBox.style.display = "block";
    } else {
      workPreviewBox.style.display = "none";
    }
  }

  function openNewWorkModal() {
    workModalTitle.textContent = "Añadir Nuevo Trabajo al Catálogo";
    workIdInput.value = "";
    workTitleInput.value = "";
    workCategoryInput.value = "semipermanente";
    workPriceInput.value = "";
    workDescInput.value = "";
    workImageUrlInput.value = "";
    workFileInput.value = "";
    showWorkPreview("");
    workModal.classList.add("active");
  }

  function openEditWorkModal(id) {
    const catalog = EpifaniaDB.getCatalog();
    const item = catalog.find(x => x.id === id);
    if (!item) return;

    workModalTitle.textContent = "Editar Trabajo & Precio";
    workIdInput.value = item.id;
    workTitleInput.value = item.titulo;
    workCategoryInput.value = item.categoria;
    workPriceInput.value = item.precio;
    workDescInput.value = item.descripcion || "";
    workImageUrlInput.value = item.imagen || item.archivo_optimizado;
    showWorkPreview(item.imagen || item.archivo_optimizado);

    workModal.classList.add("active");
  }

  function saveWorkForm() {
    const catalog = EpifaniaDB.getCatalog();
    const id = workIdInput.value;
    const isNew = !id;

    const catLabels = {
      semipermanente: "Semipermanente",
      kapping: "Kapping Gel",
      esculpidas: "Uñas Esculpidas",
      nailart: "Nail Art Exclusivo"
    };

    const categoryKey = workCategoryInput.value;
    const imageSrc = workImageUrlInput.value.trim() || "assets/img/trabajo_01.jpg";

    if (isNew) {
      const newWork = {
        id: `work-custom-${Date.now()}`,
        titulo: workTitleInput.value.trim(),
        categoria: categoryKey,
        categoria_label: catLabels[categoryKey] || "Manicura",
        descripcion: workDescInput.value.trim(),
        precio: Number(workPriceInput.value) || 0,
        imagen: imageSrc,
        destacado: false,
        fecha_creacion: new Date().toISOString()
      };
      catalog.unshift(newWork);
    } else {
      const idx = catalog.findIndex(x => x.id === id);
      if (idx !== -1) {
        catalog[idx].titulo = workTitleInput.value.trim();
        catalog[idx].categoria = categoryKey;
        catalog[idx].categoria_label = catLabels[categoryKey] || "Manicura";
        catalog[idx].descripcion = workDescInput.value.trim();
        catalog[idx].precio = Number(workPriceInput.value) || 0;
        catalog[idx].imagen = imageSrc;
      }
    }

    EpifaniaDB.saveCatalog(catalog);
    workModal.classList.remove("active");
    renderAdminCatalog();
    alert("¡Trabajo guardado con éxito! Los cambios ya se reflejan en la página web.");
  }

  function deleteWorkItem(id) {
    const catalog = EpifaniaDB.getCatalog();
    const item = catalog.find(x => x.id === id);
    if (!item) return;

    if (confirm(`¿Estás segura de eliminar "${item.titulo}" del catálogo?`)) {
      const updated = catalog.filter(x => x.id !== id);
      EpifaniaDB.saveCatalog(updated);
      renderAdminCatalog();
    }
  }

  // 5. Renderizado de Historias en Admin
  function renderAdminStories() {
    const stories = EpifaniaDB.getStories();
    tabCountStories.textContent = stories.length;
    adminStoriesGrid.innerHTML = "";

    if (stories.length === 0) {
      adminStoriesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--color-text-muted);">
          No hay historias publicadas actualmente. Tocá en "Crear Nueva Historia" para publicar una.
        </div>
      `;
      return;
    }

    stories.forEach((story, idx) => {
      const card = document.createElement("div");
      card.className = "admin-story-card";

      const safeTitulo = escapeHtml(story.titulo);
      const safeTag = escapeHtml(story.tag || "Historia");
      const safeDesc = escapeHtml(story.descripcion || "");

      card.innerHTML = `
        <div class="admin-story-thumb">
          <img src="${story.imagen}" alt="${safeTitulo}">
          <span class="work-category-badge" style="top: 8px; left: 8px;">${safeTag}</span>
        </div>
        <div style="padding: 0.85rem; display: flex; flex-direction: column; gap: 0.4rem;">
          <h4 style="font-size: 0.95rem; font-weight: 700;">${safeTitulo}</h4>
          <p style="font-size: 0.8rem; color: var(--color-text-muted); line-height: 1.3;">${safeDesc}</p>
          <div style="margin-top: 0.5rem; display: flex; gap: 0.4rem;">
            <button class="btn-item-action btn-item-delete" data-story-idx="${idx}" style="padding: 0.45rem;">
              <span>🗑️ Eliminar</span>
            </button>
          </div>
        </div>
      `;

      card.querySelector("[data-story-idx]").addEventListener("click", () => deleteStory(idx));
      adminStoriesGrid.appendChild(card);
    });
  }

  function setupStoriesEventListeners() {
    btnOpenNewStoryModal.addEventListener("click", () => {
      openNewStoryModal();
    });

    closeStoryModal.addEventListener("click", () => storyModal.classList.remove("active"));
    btnCancelStoryModal.addEventListener("click", () => storyModal.classList.remove("active"));

    storyDropzone.addEventListener("click", () => storyFileInput.click());
    storyFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          storyImageUrlInput.value = event.target.result;
          showStoryPreview(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    });

    storyImageUrlInput.addEventListener("input", () => {
      showStoryPreview(storyImageUrlInput.value);
    });

    storyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveStoryForm();
    });
  }

  function showStoryPreview(src) {
    if (src) {
      storyPreviewImg.src = src;
      storyPreviewBox.style.display = "block";
    } else {
      storyPreviewBox.style.display = "none";
    }
  }

  function openNewStoryModal() {
    storyIdInput.value = "";
    storyTitleInput.value = "";
    storyTagInput.value = "Turnos";
    storyDescInput.value = "";
    storyImageUrlInput.value = "";
    showStoryPreview("");
    storyModal.classList.add("active");
  }

  function saveStoryForm() {
    const stories = EpifaniaDB.getStories();
    const imageSrc = storyImageUrlInput.value.trim() || "assets/img/trabajo_13.jpg";

    const newStory = {
      id: `story-${Date.now()}`,
      titulo: storyTitleInput.value.trim(),
      tag: storyTagInput.value.trim() || "Novedad",
      descripcion: storyDescInput.value.trim(),
      imagen: imageSrc,
      fecha: "Hoy",
      activa: true
    };

    stories.unshift(newStory);
    EpifaniaDB.saveStories(stories);
    storyModal.classList.remove("active");
    renderAdminStories();
    alert("¡Historia publicada con éxito! Ya se visualiza en la cabecera interactiva.");
  }

  function deleteStory(idx) {
    const stories = EpifaniaDB.getStories();
    if (confirm("¿Estás segura de eliminar esta historia?")) {
      stories.splice(idx, 1);
      EpifaniaDB.saveStories(stories);
      renderAdminStories();
    }
  }

  // 6. Configuración del Negocio y Respaldo
  function loadBusinessSettings() {
    const b = EpifaniaDB.getBusiness();
    settingBusinessName.value = b.name || "";
    settingWhatsapp.value = b.whatsapp || "";
    settingInstagram.value = b.instagram || "";
    settingLocation.value = b.location || "";
    settingScheduleWeek.value = b.schedule_week || "";
    settingScheduleSat.value = b.schedule_sat || "";
  }

  function setupSettingsEventListeners() {
    businessSettingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const rawWa = settingWhatsapp.value.replace(/\D/g, "");
      const fullWaRaw = rawWa.startsWith("54") ? rawWa : ("549" + rawWa);

      const updated = {
        name: settingBusinessName.value.trim(),
        whatsapp: settingWhatsapp.value.trim(),
        whatsapp_raw: fullWaRaw,
        whatsapp_link: `https://wa.me/${fullWaRaw}`,
        instagram: settingInstagram.value.trim(),
        instagram_url: `https://www.instagram.com/${settingInstagram.value.trim().replace("@", "")}/`,
        location: settingLocation.value.trim(),
        schedule_week: settingScheduleWeek.value.trim(),
        schedule_sat: settingScheduleSat.value.trim()
      };

      EpifaniaDB.saveBusiness(updated);
      alert("¡Datos del negocio actualizados correctamente!");
    });

    changePinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = newAdminPin.value.trim();
      if (val.length >= 4) {
        EpifaniaDB.setAdminPin(val);
        newAdminPin.value = "";
        alert(`¡PIN de administración actualizado exitosamente a: ${val}!`);
      } else {
        alert("El PIN debe tener al menos 4 dígitos.");
      }
    });

    btnExportBackup.addEventListener("click", () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(EpifaniaDB.exportBackup());
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `epifania_respaldo_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });

    fileImportBackup.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (EpifaniaDB.importBackup(event.target.result)) {
            alert("¡Copia de seguridad restaurada con éxito!");
            renderAdminCatalog();
            renderAdminStories();
            loadBusinessSettings();
          } else {
            alert("Error al leer el archivo de copia de seguridad. Verificá que sea un archivo JSON válido.");
          }
        };
        reader.readAsText(file);
      }
    });

    btnResetDefaults.addEventListener("click", () => {
      if (confirm("⚠️ ¿Estás segura de restablecer el catálogo a las 19 fotos originales? Se perderán las modificaciones no respaldadas.")) {
        EpifaniaDB.resetToDefault();
        renderAdminCatalog();
        renderAdminStories();
        loadBusinessSettings();
        alert("Catálogo restablecido con las 19 fotografías originales.");
      }
    });
  }

  // 8. Gestión de Citas Agendadas desde el Asistente Virtual
  function getStoredAppointments() {
    try {
      const data = localStorage.getItem("EPIFANIA_CITAS_AGENDADAS_V1");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveStoredAppointments(list) {
    localStorage.setItem("EPIFANIA_CITAS_AGENDADAS_V1", JSON.stringify(list));
    renderAdminAppointments();
  }

  function renderAdminAppointments() {
    if (!adminAppointmentsList) return;
    const appointments = getStoredAppointments();
    if (tabCountAppointments) {
      tabCountAppointments.textContent = appointments.length;
    }

    adminAppointmentsList.innerHTML = "";

    if (appointments.length === 0) {
      adminAppointmentsList.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: var(--color-text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📅</div>
          <h3 style="font-size: 1.1rem; color: var(--color-text-main); margin-bottom: 0.35rem;">No hay citas agendadas aún</h3>
          <p style="font-size: 0.85rem; max-width: 440px; margin: 0 auto; line-height: 1.5;">
            Cuando una clienta reserve un turno desde el asistente virtual en la web de <strong>Puerto Madryn, Chubut</strong>, sus datos quedarán registrados aquí con un botón para responderle directamente a su WhatsApp.
          </p>
        </div>
      `;
      return;
    }

    appointments.forEach((apt, index) => {
      const card = document.createElement("div");
      const isConfirmed = apt.status === "confirmada";
      card.className = `admin-appointment-card ${isConfirmed ? 'is-confirmed' : ''}`;

      const dateStr = apt.fecha_creacion ? new Date(apt.fecha_creacion).toLocaleString("es-AR", {
        day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
      }) : "Reciente";

      // Formatear enlace de respuesta a WhatsApp de la clienta
      const cleanPhone = (apt.cliente_telefono || "").replace(/\D/g, "");
      const waNumber = cleanPhone.startsWith("54") ? cleanPhone : (cleanPhone.startsWith("9") ? `54${cleanPhone}` : `549${cleanPhone}`);
      const waReplyText = encodeURIComponent(
        `¡Hola ${apt.cliente_nombre}! Te escribo de Epifanía Belleza en Puerto Madryn, Chubut. ` +
        `Recibimos tu solicitud de cita para ${apt.servicio_nombre} (${apt.horario_preferido}). ` +
        `¡Tu lugar ya se encuentra agendado! Te esperamos para dejar tus manos impecables. ✨`
      );
      const waUrl = `https://wa.me/${waNumber}?text=${waReplyText}`;

      const safeCliente = escapeHtml(apt.cliente_nombre);
      const safeServicio = escapeHtml(apt.servicio_nombre);
      const safeDuracion = escapeHtml(apt.duracion_estimada || '60 min');
      const safeHorario = escapeHtml(apt.horario_preferido || 'A coordinar');
      const safePago = escapeHtml(apt.tipo_pago || 'Efectivo');
      const safeTelefono = escapeHtml(apt.cliente_telefono || '-');

      card.innerHTML = `
        <div class="appointment-header-row">
          <div class="appointment-client-name">
            <span>👤 ${safeCliente}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 0.75rem; color: var(--color-text-muted);">🕒 ${dateStr}</span>
            <span class="appointment-status-badge ${isConfirmed ? 'badge-confirmed' : 'badge-pending'}">
              ${isConfirmed ? '✓ Confirmada' : '⏳ Pendiente'}
            </span>
          </div>
        </div>

        <div class="appointment-details-grid">
          <div class="appointment-detail-item">
            <span class="detail-label">💅 Servicio Solicitado</span>
            <span class="detail-value">${safeServicio} ($${Number(apt.precio || 0).toLocaleString("es-AR")})</span>
          </div>
          <div class="appointment-detail-item">
            <span class="detail-label">⏱️ Tiempo Estimado de Sesión</span>
            <span class="detail-value">${safeDuracion}</span>
          </div>
          <div class="appointment-detail-item">
            <span class="detail-label">🕒 Horario / Fecha Deseada</span>
            <span class="detail-value">${safeHorario}</span>
          </div>
          <div class="appointment-detail-item">
            <span class="detail-label">💳 Tipo de Pago</span>
            <span class="detail-value">${safePago}</span>
          </div>
          <div class="appointment-detail-item">
            <span class="detail-label">📱 Teléfono Contacto</span>
            <span class="detail-value">${safeTelefono}</span>
          </div>
          <div class="appointment-detail-item">
            <span class="detail-label">📍 Ubicación del Estudio</span>
            <span class="detail-value">Puerto Madryn, Chubut</span>
          </div>
        </div>

        <div class="appointment-actions-row">
          <a href="${waUrl}" target="_blank" rel="noopener" class="btn-apt-wa" title="Escribir a la clienta por WhatsApp">
            <span>💬 Responder por WhatsApp</span>
          </a>
          <button class="btn-apt-confirm" data-index="${index}" title="Cambiar estado de la cita">
            <span>${isConfirmed ? 'Marcar Pendiente' : '✓ Marcar Confirmada'}</span>
          </button>
          <button class="btn-apt-delete" data-index="${index}" title="Eliminar cita">
            <span>🗑️ Eliminar</span>
          </button>
        </div>
      `;

      // Eventos
      const btnConfirm = card.querySelector(".btn-apt-confirm");
      btnConfirm.addEventListener("click", () => {
        appointments[index].status = isConfirmed ? "pendiente" : "confirmada";
        saveStoredAppointments(appointments);
      });

      const btnDelete = card.querySelector(".btn-apt-delete");
      btnDelete.addEventListener("click", () => {
        if (confirm(`¿Eliminar la cita de ${apt.cliente_nombre}?`)) {
          appointments.splice(index, 1);
          saveStoredAppointments(appointments);
        }
      });

      adminAppointmentsList.appendChild(card);
    });
  }

  function setupAppointmentsEventListeners() {
    if (btnClearAllAppointments) {
      btnClearAllAppointments.addEventListener("click", () => {
        const appointments = getStoredAppointments();
        if (appointments.length === 0) {
          alert("No hay citas registradas para eliminar.");
          return;
        }
        if (confirm("¿Estás segura de eliminar todo el historial de citas agendadas? Esta acción no se puede deshacer.")) {
          localStorage.removeItem("EPIFANIA_CITAS_AGENDADAS_V1");
          renderAdminAppointments();
        }
      });
    }
  }

  // Función de sanitización anti-XSS
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Comprobar autenticación al arrancar
  checkAuth();
});
