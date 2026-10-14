# 🏛️ Arquitectura Comercial y de Soluciones E-commerce: Epifanía Belleza
**Fecha:** 14 de Octubre de 2026 | **Agente Líder:** `ag-ecommerce-lead-10` ("Especialista en E-commerce Senior")  
**Proyecto:** Web App Comercial Mobile-First + Catálogo Interactivo + Panel `/admin` de Gestión  

---

## 1. 🎯 Objetivos de Negocio y Conversión (CRO & Funnel)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        EMBUDO DE CONVERSIÓN DE EPIFANÍA BELLEZA                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. ADQUISICIÓN: Instagram (@epifaniabelleza_), Google Maps, Recomendaciones boca a boca│
│ 2. ENGAGEMENT: Historias Interactivas (Stories) + Catálogo de 19 fotos reales con precio│
│ 3. DECISIÓN: Filtro por técnica (Semipermanente, Kapping, Esculpidas, Nail Art)        │
│ 4. CONVERSIÓN: Botón WhatsApp "Pedir Turno con este Diseño" con cotización precisa    │
│ 5. GESTIÓN ADMIN: Panel /admin para que la dueña actualice precios y fotos al instante │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Indicadores Clave de Desempeño (KPIs):
- **Tasa de Cierre de Turnos en WhatsApp:** Aumentar de 25% a 65% gracias a que la clienta ya llega sabiendo el precio y con la foto del diseño elegido.
- **Reducción de Tiempo de Respuesta:** Al llegar el mensaje con plantilla estructurada:
  > *"Hola Epifanía Belleza! Me encantó el diseño de [Nombre del Trabajo] ($[Precio]). ¿Tenés turnos disponibles para esta semana en Puerto Madryn?"*
- **AOV (Valor Promedio del Pedido):** Incrementar mediante la oferta cruzada de Kapping Gel protector o Nail Art personalizado.

---

## 2. 🏗️ Arquitectura Técnica y Modelo de Datos

### A. Almacenamiento y Persistencia (Client-Side Database)
Para garantizar máxima velocidad, cero costo de mantenimiento de servidores y portabilidad absoluta:
- **Almacén Primario:** `localStorage` del navegador bajo la clave `EPIFANIA_CATALOGO_DB` y `EPIFANIA_STORIES_DB`.
- **Carga de Respaldo Inicial:** Si `localStorage` está vacío, se precargan automáticamente las 19 fotos existentes con sus datos base.
- **Sincronización:** Cada vez que la administradora añade, edita o elimina un trabajo o historia desde el panel `/admin`, el catálogo se refresca al instante.
- **Exportación & Importación:** Botones para descargar un archivo `epifania_backup.json` con todos los cambios y restaurarlo en cualquier dispositivo.

### B. Esquema de Entidades

#### 1. Entidad: `Producto / Trabajo de Catálogo`
```json
{
  "id": "trabajo-01",
  "titulo": "Esmaltado Semipermanente Frenchie & Glaze",
  "categoria": "semipermanente",
  "descripcion": "Esmaltado de larga duración con técnica rusa y acabado perlado glaze.",
  "precio": 18000,
  "imagen": "WhatsApp Image 2026-10-01 at 20.05.32.jpeg",
  "destacado": true,
  "activo": true,
  "fecha_creacion": "2026-10-14"
}
```

#### 2. Entidad: `Historia (Story)`
```json
{
  "id": "story-01",
  "titulo": "Turnos disponibles",
  "subtitulo": "Jueves y Viernes",
  "imagen": "gf.jpeg",
  "enlace_accion": "https://wa.me/5492804968223?text=Hola!%20Vi%20la%20historia%20de%20turnos",
  "texto_boton": "Reservar Ahora",
  "activa": true
}
```

---

## 3. 🛡️ Especificación del Panel de Administración (`/admin`)

- **Ruta de Acceso:** Oculto para clientas; ubicado en `/admin` (`admin/index.html` o ruta `/admin`), accesible mediante URL directa, hash `index.html#admin` o toque secreto en el pie de página.
- **Control de Seguridad:** Validación por código PIN (PIN inicial por defecto: `141026`), editable desde el panel.
- **Módulos del Panel:**
  1. **Gestión de Historias:**
     - Subida de nueva imagen (arrastrar archivo o seleccionar de la galería).
     - Título, descripción y texto de acción.
     - Lista de historias activas con botón de previsualización y eliminación.
  2. **Gestión del Catálogo de Trabajos:**
     - Formulario de alta de nuevo trabajo (Foto, Nombre, Técnica/Categoría, Descripción, Precio).
     - Tabla/Grilla visual de los trabajos existentes.
     - Modal de edición rápida: modificar leyenda de tipo de trabajo y precio en 2 clics.
     - Botón de eliminar con confirmación de seguridad.
  3. **Ajustes y Respaldo:**
     - Descarga de copia de seguridad JSON.
     - Restauración de copia de seguridad.
     - Botón de "Restablecer catálogo inicial con las 19 fotos".

---

## 4. 🔍 Optimización SEO Técnico & Schema.org JSON-LD

Se incorpora la especificación semántica de Schema.org para posicionamiento local en Google:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "name": "Epifanía Belleza",
  "image": "assets/img/gf.jpeg",
  "telephone": "+54 9 280 496-8223",
  "url": "https://epifaniabelleza.com.ar",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Puerto Madryn",
    "addressRegion": "Chubut",
    "addressCountry": "AR"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "20:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "15:00"
    }
  ],
  "priceRange": "$$",
  "servesCuisine": "Nail Spa & Beauty Services"
}
</script>
```

---

## 5. 🚀 Directivas de Handoff para el Siguiente Recluta
- **Recluta Destino:** `ag-ecommerce-photo-editor-09`
- **Misión Inmediata:** Catalogar, organizar y normalizar las 19 imágenes provistas en el proyecto, asociándoles identificadores legibles, etiquetas de técnica y nombres optimizados para web.
