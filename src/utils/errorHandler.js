export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message || "Error desconocido");

  // Detecta si es una solicitud AJAX o API (que típicamente espera JSON)
  if (req.xhr || req.headers.accept.includes("application/json")) {
    // Respuesta en formato JSON para solicitudes de API (como Postman)
    res.status(err.status || 500).json({
      status: "error",
      error: err.message || "Ocurrió un error en el servidor",
    });
  } else {
    // Renderiza una vista de error para solicitudes en el navegador
    res.status(err.status || 500).render("error", {
      status: err.status || 500,
      message: err.message || "Ocurrió un error en el servidor",
    });
  }
};
