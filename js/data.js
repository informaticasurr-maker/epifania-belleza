/**
 * Epifanía Belleza - Sistema de Datos y Persistencia
 * Administrado por ag-web-builder-04 & ag-ecommerce-lead-10
 */

const DEFAULT_BUSINESS = {
  name: "Epifanía Belleza",
  rubro: "Servicio de Belleza en Uñas & Estética",
  slogan: "Realzamos la belleza y elegancia natural de tus manos",
  whatsapp: "280 496-8223",
  whatsapp_raw: "5492804968223",
  whatsapp_link: "https://wa.me/5492804968223",
  instagram: "epifaniabelleza_",
  instagram_url: "https://www.instagram.com/epifaniabelleza_/",
  location: "Puerto Madryn, Chubut, Argentina",
  schedule_week: "Lunes a Viernes de 9:00 hs a 20:00 hs",
  schedule_sat: "Sábados de 9:00 hs a 15:00 hs",
  schedule_sun: "Domingos cerrado",
  admin_pin: "141026",
  logo: "assets/img/logo.png"
};

const DEFAULT_STORIES = [
  {
    id: "story-1",
    titulo: "¡Turnos Disponibles!",
    subtitulo: "Jueves y Viernes",
    descripcion: "Escribinos por WhatsApp para asegurar tu lugar esta semana en Puerto Madryn ✨",
    imagen: "assets/img/trabajo_13.jpg",
    tag: "Turnos",
    fecha: "Hoy",
    activa: true
  },
  {
    id: "story-2",
    titulo: "Nuevos Colores Nude & Glaze",
    subtitulo: "Colección Primavera / Verano",
    descripcion: "Esmaltados semipermanentes con brillo espejo y efecto aperlado.",
    imagen: "assets/img/trabajo_01.jpg",
    tag: "Novedad",
    fecha: "Ayer",
    activa: true
  },
  {
    id: "story-3",
    titulo: "Kapping Gel Protector",
    subtitulo: "Uñas Fuertes y Naturales",
    descripcion: "Ideal si tus uñas se quiebran o descaman. Refuerzo invisible de larga duración.",
    imagen: "assets/img/trabajo_07.jpg",
    tag: "Tratamiento",
    fecha: "Esta semana",
    activa: true
  }
];

// Las 19 fotos originales mapeadas
const DEFAULT_CATALOG = [
  {
    id: "work-01",
    titulo: "Semipermanente Nude Clásico",
    categoria: "semipermanente",
    categoria_label: "Semipermanente",
    descripcion: "Esmaltado semipermanente en tono nude natural con brillo sellador de alta duración.",
    precio: 18000,
    imagen: "assets/img/trabajo_01.jpg",
    imagen_original: "WhatsApp Image 2026-10-01 at 20.05.32.jpeg",
    destacado: true
  },
  {
    id: "work-02",
    titulo: "Kapping Gel & Frenchie Delicada",
    categoria: "kapping",
    categoria_label: "Kapping Gel",
    descripcion: "Refuerzo estructural en uña natural con terminación francesita clásica fina.",
    precio: 23000,
    imagen: "assets/img/trabajo_02.jpg",
    imagen_original: "WhatsApp Image 2026-10-01 at 20.12.20 (2).jpeg",
    destacado: false
  },
  {
    id: "work-03",
    titulo: "Esculpidas Almendradas en Gel",
    categoria: "esculpidas",
    categoria_label: "Uñas Esculpidas",
    descripcion: "Construcción en gel esculpido con forma almendra y curvatura C perfecta.",
    precio: 29000,
    imagen: "assets/img/trabajo_03.jpg",
    imagen_original: "WhatsApp Image 2026-10-01 at 20.12.20 (3).jpeg",
    destacado: true
  },
  {
    id: "work-04",
    titulo: "Nail Art Minimalista & Foil Dorado",
    categoria: "nailart",
    categoria_label: "Nail Art Exclusivo",
    descripcion: "Diseño sutil a mano alzada con toques de pan de oro y acabado ultra brillante.",
    precio: 26000,
    imagen: "assets/img/trabajo_04.jpg",
    imagen_original: "WhatsApp Image 2026-10-01 at 20.12.21.jpeg",
    destacado: false
  },
  {
    id: "work-05",
    titulo: "Semipermanente Rojo Intenso",
    categoria: "semipermanente",
    categoria_label: "Semipermanente",
    descripcion: "El clásico que nunca falla: esmaltado rojo pasión con cutículas impecables.",
    precio: 18000,
    imagen: "assets/img/trabajo_05.jpg",
    imagen_original: "WhatsApp Image 2026-10-01 at 20.18.12.jpeg",
    destacado: false
  },
  {
    id: "work-06",
    titulo: "Kapping Gel con Glitter Degradé",
    categoria: "kapping",
    categoria_label: "Kapping Gel",
    descripcion: "Capa de gel nivelador con esfumado de brillos sutiles en las puntas.",
    precio: 24000,
    imagen: "assets/img/trabajo_06.jpg",
    imagen_original: "d.jpeg",
    destacado: false
  },
  {
    id: "work-07",
    titulo: "Soft Gel Coffin & Tono Capuchino",
    categoria: "esculpidas",
    categoria_label: "Uñas Esculpidas",
    descripcion: "Extensión en tips Soft Gel forma coffin en color café con leche sofisticado.",
    precio: 28000,
    imagen: "assets/img/trabajo_07.jpg",
    imagen_original: "df001.jpeg",
    destacado: true
  },
  {
    id: "work-08",
    titulo: "Nail Art Efecto Mármol & Cuarzo",
    categoria: "nailart",
    categoria_label: "Nail Art Exclusivo",
    descripcion: "Textura efecto mármol blanco y rosa cuarzo con destellos finos.",
    precio: 27000,
    imagen: "assets/img/trabajo_08.jpg",
    imagen_original: "df002.jpeg",
    destacado: false
  },
  {
    id: "work-09",
    titulo: "Semipermanente Pastel Lavanda",
    categoria: "semipermanente",
    categoria_label: "Semipermanente",
    descripcion: "Color lavanda suave primaveral, manicura rusa y exfoliación de manos.",
    precio: 18000,
    imagen: "assets/img/trabajo_09.jpg",
    imagen_original: "df003.jpeg",
    destacado: false
  },
  {
    id: "work-10",
    titulo: "Kapping Gel Nude Rosado",
    categoria: "kapping",
    categoria_label: "Kapping Gel",
    descripcion: "Refuerzo con gel autonivelante en tono cover pink natural para uso diario.",
    precio: 23000,
    imagen: "assets/img/trabajo_10.jpg",
    imagen_original: "df004.jpeg",
    destacado: false
  },
  {
    id: "work-11",
    titulo: "Esculpidas Square & Francesita Negra",
    categoria: "esculpidas",
    categoria_label: "Uñas Esculpidas",
    descripcion: "Forma cuadrada moderna con línea de sonrisa negra azabache de máxima precisión.",
    precio: 29000,
    imagen: "assets/img/trabajo_11.jpg",
    imagen_original: "df005.jpeg",
    destacado: false
  },
  {
    id: "work-12",
    titulo: "Nail Art Geométrico & Líneas Finas",
    categoria: "nailart",
    categoria_label: "Nail Art Exclusivo",
    descripcion: "Líneas de precisión a mano alzada con pincel liner 000 sobre base translúcida.",
    precio: 25000,
    imagen: "assets/img/trabajo_12.jpg",
    imagen_original: "g.jpeg",
    destacado: false
  },
  {
    id: "work-13",
    titulo: "Set Premium Glazed Donut Nails",
    categoria: "semipermanente",
    categoria_label: "Semipermanente",
    descripcion: "Efecto perla cromada viral con polvo holográfico sobre base milky.",
    precio: 20000,
    imagen: "assets/img/trabajo_13.jpg",
    imagen_original: "gf.jpeg",
    destacado: true
  },
  {
    id: "work-14",
    titulo: "Kapping con Cristalería Strass",
    categoria: "kapping",
    categoria_label: "Kapping Gel",
    descripcion: "Protección de gel con detalle de pedrería y cristales aplicados en cutícula.",
    precio: 25000,
    imagen: "assets/img/trabajo_14.jpg",
    imagen_original: "ggg.jpeg",
    destacado: false
  },
  {
    id: "work-15",
    titulo: "Esculpidas Stiletto Baby Boomer",
    categoria: "esculpidas",
    categoria_label: "Uñas Esculpidas",
    descripcion: "Degradé ombré suave de blanco a rosa en estructura esculpida resistente.",
    precio: 30000,
    imagen: "assets/img/trabajo_15.jpg",
    imagen_original: "gh.jpeg",
    destacado: true
  },
  {
    id: "work-16",
    titulo: "Nail Art Floral Primaveral",
    categoria: "nailart",
    categoria_label: "Nail Art Exclusivo",
    descripcion: "Micropintura de flores delicadas sobre dos uñas con acabado mate aterciopelado.",
    precio: 26000,
    imagen: "assets/img/trabajo_16.jpg",
    imagen_original: "r001.jpeg",
    destacado: false
  },
  {
    id: "work-17",
    titulo: "Semipermanente Vía Láctea & Glitter",
    categoria: "semipermanente",
    categoria_label: "Semipermanente",
    descripcion: "Base milky translúcida con lluvia de destellos holográficos para eventos.",
    precio: 19000,
    imagen: "assets/img/trabajo_17.jpg",
    imagen_original: "r003.jpeg",
    destacado: false
  },
  {
    id: "work-18",
    titulo: "Kapping Gel Rubber Base",
    categoria: "kapping",
    categoria_label: "Kapping Gel",
    descripcion: "Base elástica con caucho sintético ideal para uñas flexibles o quebradizas.",
    precio: 23000,
    imagen: "assets/img/trabajo_18.jpg",
    imagen_original: "r004.jpeg",
    destacado: false
  },
  {
    id: "work-19",
    titulo: "Diseño Frenchie Invertida & Acabado Gloss",
    categoria: "nailart",
    categoria_label: "Nail Art Exclusivo",
    descripcion: "Luneta en cutícula con contraste de color y baño final de brillo glass.",
    precio: 25000,
    imagen: "assets/img/trabajo_19.jpg",
    imagen_original: "r005.jpeg",
    destacado: false
  }
];

// Gestión de Persistencia en LocalStorage
const STORAGE_KEYS = {
  CATALOG: "EPIFANIA_CATALOG_DATA_V1",
  STORIES: "EPIFANIA_STORIES_DATA_V1",
  BUSINESS: "EPIFANIA_BUSINESS_DATA_V1",
  PIN: "EPIFANIA_ADMIN_PIN_V1"
};

const EpifaniaDB = {
  getBusiness() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUSINESS);
      return data ? { ...DEFAULT_BUSINESS, ...JSON.parse(data) } : DEFAULT_BUSINESS;
    } catch (e) {
      return DEFAULT_BUSINESS;
    }
  },

  saveBusiness(businessData) {
    try {
      localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(businessData));
      return true;
    } catch (e) {
      console.error("Error guardando datos de negocio", e);
      return false;
    }
  },

  getCatalog() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATALOG);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Fallo lectura catalogo, usando defaults", e);
    }
    // Inicializar con los 19 trabajos
    this.saveCatalog(DEFAULT_CATALOG);
    return DEFAULT_CATALOG;
  },

  saveCatalog(catalogArray) {
    try {
      localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(catalogArray));
      window.dispatchEvent(new CustomEvent("epifania:catalog-updated", { detail: catalogArray }));
      return true;
    } catch (e) {
      console.error("Error guardando catalogo", e);
      return false;
    }
  },

  getStories() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STORIES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Fallo lectura stories, usando defaults", e);
    }
    this.saveStories(DEFAULT_STORIES);
    return DEFAULT_STORIES;
  },

  saveStories(storiesArray) {
    try {
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(storiesArray));
      window.dispatchEvent(new CustomEvent("epifania:stories-updated", { detail: storiesArray }));
      return true;
    } catch (e) {
      console.error("Error guardando historias", e);
      return false;
    }
  },

  getAdminPin() {
    const savedPin = localStorage.getItem(STORAGE_KEYS.PIN);
    if (!savedPin || savedPin === "1234") {
      try { localStorage.setItem(STORAGE_KEYS.PIN, "141026"); } catch (e) {}
      return "141026";
    }
    return savedPin;
  },

  setAdminPin(pin) {
    const finalPin = pin || "141026";
    try { localStorage.setItem(STORAGE_KEYS.PIN, finalPin); } catch (e) {}
    return true;
  },

  // Reset total a los valores originales (19 fotos)
  resetToDefault() {
    localStorage.removeItem(STORAGE_KEYS.CATALOG);
    localStorage.removeItem(STORAGE_KEYS.STORIES);
    localStorage.removeItem(STORAGE_KEYS.BUSINESS);
    localStorage.removeItem(STORAGE_KEYS.PIN);
    this.saveCatalog(DEFAULT_CATALOG);
    this.saveStories(DEFAULT_STORIES);
    return true;
  },

  // Exportar copia de seguridad en JSON
  exportBackup() {
    const backup = {
      version: "1.0",
      fecha: new Date().toISOString(),
      negocio: this.getBusiness(),
      catalogo: this.getCatalog(),
      historias: this.getStories()
    };
    return JSON.stringify(backup, null, 2);
  },

  // Importar copia de seguridad desde JSON
  importBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.catalogo && Array.isArray(parsed.catalogo)) {
        this.saveCatalog(parsed.catalogo);
      }
      if (parsed.historias && Array.isArray(parsed.historias)) {
        this.saveStories(parsed.historias);
      }
      if (parsed.negocio) {
        this.saveBusiness(parsed.negocio);
      }
      return true;
    } catch (e) {
      console.error("Error importando backup:", e);
      return false;
    }
  },

  formatPrice(price) {
    const num = Number(price) || 0;
    return "$" + num.toLocaleString("es-AR");
  }
};

window.EpifaniaDB = EpifaniaDB;
