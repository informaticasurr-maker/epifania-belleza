/**
 * Epifanía Belleza - Configuración e Inicialización de Firebase
 * Proyecto: epifania-belleza
 * Ubicación: Puerto Madryn, Chubut
 */

export const firebaseConfig = {
  apiKey: "AIzaSyBpotS6roZw3Ts-W1Ngaf6XSZzrYfK5HZs",
  authDomain: "epifania-belleza.firebaseapp.com",
  projectId: "epifania-belleza",
  storageBucket: "epifania-belleza.firebasestorage.app",
  messagingSenderId: "696996771019",
  appId: "1:696996771019:web:5b8395cc4ba16a0624d74e"
};

// Exposición global para scripts tradicionales
if (typeof window !== "undefined") {
  window.firebaseConfig = firebaseConfig;
}
