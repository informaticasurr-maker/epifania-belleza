/**
 * Epifanía Belleza - Lógica Frontend Principal
 * Desarrollado por ag-web-builder-04
 */

document.addEventListener("DOMContentLoaded", () => {
  // Estado de la aplicación
  let currentCategory = "todas";
  let storiesList = [];
  let catalogList = [];
  let businessData = {};

  // Estado del reproductor de historias
  let currentStoryIndex = 0;
  let storyTimer = null;
  let storyStartTime = 0;
  let storyDuration = 5000; // 5 segundos por historia
  let isStoryPaused = false;

  // Elementos DOM principales
  const storiesContainer = document.getElementById("storiesContainer");
  const catalogGrid = document.getElementById("catalogGrid");
  const filterChips = document.querySelectorAll(".filter-chip");
  const catalogCountSpan = document.getElementById("catalogCount");

  // Modal de Historias
  const storiesModal = document.getElementById("storiesModal");
  const storyProgressBarContainer = document.getElementById("storyProgressBars");
  const storyMediaImg = document.getElementById("storyMediaImg");
  const storyUsername = document.getElementById("storyUsername");
  const storyTimestamp = document.getElementById("storyTimestamp");
  const storyCaptionTitle = document.getElementById("storyCaptionTitle");
  const storyCaptionText = document.getElementById("storyCaptionText");
  const storyActionBtn = document.getElementById("storyActionBtn");
  const storyCloseBtn = document.getElementById("storyCloseBtn");
  const storyTapLeft = document.getElementById("storyTapLeft");
  const storyTapRight = document.getElementById("storyTapRight");

  // Modal de Detalle de Foto
  const photoDetailModal = document.getElementById("photoDetailModal");
  const photoModalImg = document.getElementById("photoModalImg");
  const photoModalBadge = document.getElementById("photoModalBadge");
  const photoModalTitle = document.getElementById("photoModalTitle");
  const photoModalDesc = document.getElementById("photoModalDesc");
  const photoModalPrice = document.getElementById("photoModalPrice");
  const photoModalWaBtn = document.getElementById("photoModalWaBtn");
  const photoModalClose = document.getElementById("photoModalClose");

  // 1. Cargar Datos Iniciales
  function initApp() {
    businessData = EpifaniaDB.getBusiness();
    storiesList = EpifaniaDB.getStories();
    catalogList = EpifaniaDB.getCatalog();

    renderStories();
    renderCatalog();
    setupFilters();
    setupStoryViewerEvents();
    setupPhotoModalEvents();
    setupLiveListeners();
  }

  // 2. Renderizar Historias
  function renderStories() {
    if (!storiesContainer) return;
    storiesContainer.innerHTML = "";

    // Story Avatar principal del negocio
    const firstStoryImg = storiesList.length > 0 ? storiesList[0].imagen : (businessData.logo || "assets/img/logo.png");
    
    // Si no hay historias cargadas, mostrar placeholder
    if (storiesList.length === 0) {
      storiesContainer.innerHTML = `
        <div class="story-item" onclick="window.open('${businessData.whatsapp_link}', '_blank')">
          <div class="story-ring seen">
            <img src="${firstStoryImg}" alt="Epifanía" class="story-avatar-img">
          </div>
          <span class="story-title">Turnos</span>
        </div>
      `;
      return;
    }

    storiesList.forEach((story, idx) => {
      const storyEl = document.createElement("div");
      storyEl.className = "story-item";
      const safeTitulo = escapeHtml(story.titulo);
      const safeTag = escapeHtml(story.tag || story.titulo);
      storyEl.innerHTML = `
        <div class="story-ring" id="storyRing-${idx}">
          <img src="${story.imagen}" alt="${safeTitulo}" class="story-avatar-img" loading="lazy">
        </div>
        <span class="story-title">${safeTag}</span>
      `;
      storyEl.addEventListener("click", () => openStoryViewer(idx));
      storiesContainer.appendChild(storyEl);
    });
  }

  // 3. Renderizar Catálogo de Trabajos (19 Fotos con Leyenda y Precio)
  function renderCatalog() {
    if (!catalogGrid) return;
    catalogGrid.innerHTML = "";

    const filtered = catalogList.filter(item => {
      if (currentCategory === "todas") return true;
      return item.categoria === currentCategory;
    });

    if (catalogCountSpan) {
      catalogCountSpan.textContent = `(${filtered.length})`;
    }

    if (filtered.length === 0) {
      catalogGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--color-text-muted);">
          <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No se encontraron trabajos en esta categoría.</p>
          <button onclick="document.querySelector('[data-category=todas]').click()" class="btn-primary-wa" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
            Ver todos los trabajos
          </button>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "work-card fade-in";
      card.dataset.id = item.id;

      const formattedPrice = EpifaniaDB.formatPrice(item.precio);

      // Enlace dinámico a WhatsApp para este trabajo específico
      const waMessage = encodeURIComponent(
        `¡Hola Epifanía Belleza! Me encantó el diseño de ${item.titulo} (${formattedPrice}). ¿Tenés turnos disponibles para esta semana en Puerto Madryn?`
      );
      const waLink = `https://wa.me/${businessData.whatsapp_raw}?text=${waMessage}`;

      const safeTitulo = escapeHtml(item.titulo);
      const safeCatLabel = escapeHtml(item.categoria_label || "Manicura");
      const safeDesc = escapeHtml(item.descripcion || "Diseño exclusivo y manicura profesional con productos de máxima calidad.");

      card.innerHTML = `
        <div class="work-image-wrapper" title="Ver foto ampliada">
          <img src="${item.imagen || item.archivo_optimizado}" alt="${safeTitulo}" class="work-image" loading="lazy">
          <span class="work-category-badge">${safeCatLabel}</span>
          <button class="work-zoom-btn" aria-label="Ampliar foto">🔍</button>
        </div>
        <div class="work-details">
          <h3 class="work-title">${safeTitulo}</h3>
          <p class="work-desc">${safeDesc}</p>
          <div class="work-price-row">
            <span class="price-label">Precio</span>
            <span class="price-amount">${formattedPrice}</span>
          </div>
          <a href="${waLink}" target="_blank" rel="noopener" class="btn-book-card btn-touch">
            <span>💅 Pedir Turno con este Diseño</span>
          </a>
        </div>
      `;

      // Evento para abrir zoom de foto
      const imgWrapper = card.querySelector(".work-image-wrapper");
      imgWrapper.addEventListener("click", (e) => {
        // Si el usuario toca el botón de zoom o hace click directo
        openPhotoModal(item);
      });

      // Efecto interactivo: activar movimiento de manos al tocar o deslizar en celulares
      imgWrapper.addEventListener("touchstart", () => {
        card.classList.add("hand-moving");
        setTimeout(() => card.classList.remove("hand-moving"), 3200);
      }, { passive: true });

      catalogGrid.appendChild(card);
    });

    // Activar sutil animación de manos al hacer scroll por el catálogo
    initHandMotionObserver();
  }

  // Observador de intersección para mover las manos sutilmente al aparecer en pantalla
  function initHandMotionObserver() {
    if (!("IntersectionObserver" in window)) return;
    const cards = document.querySelectorAll(".work-card");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("hand-moving");
          setTimeout(() => {
            entry.target.classList.remove("hand-moving");
          }, 3000);
        }
      });
    }, { threshold: 0.45 });

    cards.forEach(c => observer.observe(c));
  }

  // 4. Configuración de Filtros
  function setupFilters() {
    filterChips.forEach(chip => {
      chip.addEventListener("click", () => {
        filterChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        currentCategory = chip.dataset.category || "todas";
        renderCatalog();
      });
    });
  }

  // 5. Visualizador de Historias (Instagram Stories Player)
  function openStoryViewer(index) {
    if (storiesList.length === 0) return;
    currentStoryIndex = Math.min(Math.max(index, 0), storiesList.length - 1);
    storiesModal.classList.add("active");
    document.body.style.overflow = "hidden";
    playStory(currentStoryIndex);
  }

  function closeStoryViewer() {
    clearTimeout(storyTimer);
    storiesModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  function playStory(index) {
    clearTimeout(storyTimer);
    const story = storiesList[index];
    if (!story) {
      closeStoryViewer();
      return;
    }

    // Renderizar barras de progreso superiores
    storyProgressBarContainer.innerHTML = "";
    storiesList.forEach((_, i) => {
      const seg = document.createElement("div");
      seg.className = "progress-bar-segment";
      const fill = document.createElement("div");
      fill.className = "progress-bar-fill";
      if (i < index) fill.classList.add("completed");
      if (i === index) fill.classList.add("active");
      seg.appendChild(fill);
      storyProgressBarContainer.appendChild(seg);
    });

    // Cargar contenido de la historia
    storyMediaImg.src = story.imagen;
    storyUsername.textContent = businessData.name;
    storyTimestamp.textContent = story.fecha || "Reciente";
    storyCaptionTitle.textContent = story.titulo || "";
    storyCaptionText.textContent = story.descripcion || "";

    const waStoryMsg = encodeURIComponent(
      `¡Hola Epifanía Belleza! Vi tu historia "${story.titulo}" en la web y me gustaría consultar por turnos en Puerto Madryn.`
    );
    storyActionBtn.href = `https://wa.me/${businessData.whatsapp_raw}?text=${waStoryMsg}`;

    // Marcar como vista
    const ring = document.getElementById(`storyRing-${index}`);
    if (ring) ring.classList.add("seen");

    // Temporizador automático de 5 segundos
    storyStartTime = Date.now();
    storyTimer = setTimeout(() => {
      if (currentStoryIndex < storiesList.length - 1) {
        currentStoryIndex++;
        playStory(currentStoryIndex);
      } else {
        closeStoryViewer();
      }
    }, storyDuration);
  }

  function nextStory() {
    if (currentStoryIndex < storiesList.length - 1) {
      currentStoryIndex++;
      playStory(currentStoryIndex);
    } else {
      closeStoryViewer();
    }
  }

  function prevStory() {
    if (currentStoryIndex > 0) {
      currentStoryIndex--;
      playStory(currentStoryIndex);
    } else {
      playStory(0);
    }
  }

  function setupStoryViewerEvents() {
    if (!storiesModal) return;

    storyCloseBtn.addEventListener("click", closeStoryViewer);
    storyTapLeft.addEventListener("click", (e) => { e.stopPropagation(); prevStory(); });
    storyTapRight.addEventListener("click", (e) => { e.stopPropagation(); nextStory(); });

    // Pausar historia al mantener presionado
    const container = document.querySelector(".story-player-container");
    if (container) {
      const pauseStory = () => {
        if (!isStoryPaused) {
          clearTimeout(storyTimer);
          isStoryPaused = true;
          const activeFill = document.querySelector(".progress-bar-fill.active");
          if (activeFill) activeFill.style.animationPlayState = "paused";
        }
      };

      const resumeStory = () => {
        if (isStoryPaused) {
          isStoryPaused = false;
          const elapsed = Date.now() - storyStartTime;
          const remaining = Math.max(storyDuration - elapsed, 1000);
          const activeFill = document.querySelector(".progress-bar-fill.active");
          if (activeFill) activeFill.style.animationPlayState = "running";
          storyTimer = setTimeout(nextStory, remaining);
        }
      };

      container.addEventListener("mousedown", pauseStory);
      container.addEventListener("mouseup", resumeStory);
      container.addEventListener("touchstart", pauseStory, { passive: true });
      container.addEventListener("touchend", resumeStory, { passive: true });
    }
  }

  // 6. Modal de Zoom de Foto
  function openPhotoModal(item) {
    if (!photoDetailModal) return;
    photoModalImg.src = item.imagen || item.archivo_optimizado;
    photoModalBadge.textContent = item.categoria_label || "Manicura";
    photoModalTitle.textContent = item.titulo;
    photoModalDesc.textContent = item.descripcion;
    photoModalPrice.textContent = EpifaniaDB.formatPrice(item.precio);

    const waMsg = encodeURIComponent(
      `Hola Epifanía Belleza! Me gustaría pedir un turno para hacerme el diseño "${item.titulo}" (${EpifaniaDB.formatPrice(item.precio)}). ¿Qué días tenés disponibles en Puerto Madryn?`
    );
    photoModalWaBtn.href = `https://wa.me/${businessData.whatsapp_raw}?text=${waMsg}`;

    photoDetailModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closePhotoModal() {
    if (!photoDetailModal) return;
    photoDetailModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  function setupPhotoModalEvents() {
    if (photoModalClose) {
      photoModalClose.addEventListener("click", closePhotoModal);
    }
    if (photoDetailModal) {
      photoDetailModal.addEventListener("click", (e) => {
        if (e.target === photoDetailModal) closePhotoModal();
      });
    }
  }

  // 7. Escuchadores para sincronización en tiempo real con /admin
  function setupLiveListeners() {
    window.addEventListener("epifania:catalog-updated", (e) => {
      catalogList = e.detail;
      renderCatalog();
    });

    window.addEventListener("epifania:stories-updated", (e) => {
      storiesList = e.detail;
      renderStories();
    });

    window.addEventListener("storage", (e) => {
      if (e.key === "EPIFANIA_CATALOG_DATA_V1" || e.key === "EPIFANIA_STORIES_DATA_V1") {
        catalogList = EpifaniaDB.getCatalog();
        storiesList = EpifaniaDB.getStories();
        renderStories();
        renderCatalog();
      }
    });
  }

  // 8. Acceso Oculto al Panel /admin
  function setupHiddenAdminAccess() {
    // Si la URL contiene #admin o /admin
    if (window.location.hash.toLowerCase() === "#admin") {
      window.location.href = "admin/";
    }
    window.addEventListener("hashchange", () => {
      if (window.location.hash.toLowerCase() === "#admin") {
        window.location.href = "admin/";
      }
    });

    // Atajo de teclado discreto (Ctrl+Shift+A o Alt+A)
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") || (e.altKey && e.key.toLowerCase() === "a")) {
        e.preventDefault();
        window.location.href = "admin/";
      }
    });

    // Toque secreto (5 toques rápidos en el copyright del pie de página)
    const footerCopy = document.getElementById("footerCopy");
    if (footerCopy) {
      let tapCount = 0;
      let lastTapTime = 0;
      footerCopy.addEventListener("click", () => {
        const now = Date.now();
        if (now - lastTapTime < 500) {
          tapCount++;
          if (tapCount >= 5) {
            window.location.href = "admin/";
          }
        } else {
          tapCount = 1;
        }
        lastTapTime = now;
      });
    }
  }

  // 9. Registro de Service Worker para PWA instalable en escritorio y móviles
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        // En entornos sin HTTPS estricto o locales se ejecuta el fallback
      });
    });
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

  // Inicializar ejecución
  setupHiddenAdminAccess();
  initApp();
});


