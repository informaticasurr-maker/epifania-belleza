# 📋 Ficha Maestra de Datos de Proyecto: Epifanía Belleza
**Fecha:** 14 de Octubre de 2026 | **Agente Relevador:** `ag-project-data-06` ("El Relevador de Datos")  
**Estado:** ✅ Validado para Desarrollo y Configuración del Panel `/admin`  

---

## 1. 🏷️ Identidad & Marca
- **Nombre Comercial:** Epifanía Belleza
- **Rubro Principal:** Estudio de Belleza, Estética y Manicura Profesional
- **Especialidades:** Esmaltado Semipermanente, Kapping Gel, Uñas Esculpidas, Soft Gel, Nail Art de Alta Precisión y Cuidado Integral de Uñas
- **Eslogan / Propuesta de Valor:** *"Realzamos la belleza y elegancia natural de tus manos en Puerto Madryn"*

---

## 2. 📍 Contacto & Ubicación
- **Teléfono / WhatsApp de Atención:** `+54 9 280 496-8223` (Número local: `280 496-8223`)
- **Enlace Directo WhatsApp:** `https://wa.me/5492804968223`
- **Ubicación:** Puerto Madryn, Chubut, Argentina
- **Instagram Oficial:** `@epifaniabelleza_` (https://instagram.com/epifaniabelleza_)

---

## 3. ⏰ Horarios de Atención
- **Lunes a Viernes:** 09:00 hs a 20:00 hs (Horario corrido)
- **Sábados:** 09:00 hs a 15:00 hs
- **Domingos y Feriados:** Cerrado (Atención solo con turnos especiales previamente coordinados)

---

## 4. 📸 Multimedia y Activos Provistos
- **Banco de Fotos Inicial:** 19 fotografías reales de trabajos de manicura y estética ubicadas en el directorio raíz.
- **Estructura Requerida por Foto:**
  - Visualizador de imagen en alta resolución con zoom / modal.
  - Leyenda / Tipo de trabajo (ej: Semipermanente, Kapping Gel, Soft Gel, Nail Art).
  - Precio visible (en pesos argentinos ARS).
  - Ambos campos 100% editables por el administrador desde el panel.
  - Botón directo "Pedir Turno con este Diseño" con enlace a WhatsApp.

---

## 5. 🎨 Paleta de Colores y Estilo Visual (UI/UX)
- **Estilo:** Sofisticado, elegante, femenino, limpio y moderno (Beauty & Nail Spa aesthetic).
- **Colores:**
  - Primario (Rosa Nude & Rose Gold): `#E8A598` / `#D48B7B`
  - Secundario (Champagne Cálido): `#F7EDE2`
  - Fondo Suave (Luz Sedosa): `#FDFBF7`
  - Fondo Oscuro / Contenedores: `#1A1615` / `#26201E`
  - Textos y Títulos: `#2C2422` (Modo claro) / `#F5F2EB` (Modo oscuro)
  - Acento Dorado / Destacados: `#C5A059`
- **Tipografía:** *Outfit* (cuerpo y botones) y *Playfair Display* (títulos de marca y elegancia).

---

## 6. 📱 Arquitectura del Sitio Web y Panel `/admin`
- **Frontend Público:**
  - Barra de Historias Interactivas (Instagram Stories Feel): Avatar circular con anillo animado de estado para ver historias activas.
  - Hero Banner con propuesta de valor y acceso rápido a WhatsApp.
  - Barra de filtros rápidos por técnica (Todos, Semipermanente, Kapping, Esculpidas, Nail Art).
  - Grilla interactiva de las 19 fotos iniciales con títulos, descripciones y precios.
  - Tarjeta de información comercial (Horarios, WhatsApp, Instagram, Ubicación Puerto Madryn).
  - Botón flotante de WhatsApp siempre accesible.
- **Panel de Administración (`/admin`):**
  - **Módulo de Historias:** Subir foto/imagen, titular, duración, previsualizar y borrar historias activas.
  - **Módulo de Catálogo & Trabajos:**
    - Agregar nuevo trabajo con foto (carga local / URL), tipo de servicio, descripción y precio.
    - Editar título, categoría, precio y notas de cualquier trabajo existente en tiempo real.
    - Eliminar trabajos obsoletos.
  - **Persistencia de Datos:** Guardado local seguro (`localStorage`) con opción de exportar/importar respaldo JSON y reinicio a valores iniciales.
  - **Seguridad:** Acceso protegido mediante PIN/contraseña de administración.
