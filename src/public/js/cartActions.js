// public/js/cartActions.js

// Vaciar el carrito especificado
async function clearCart(cartId) {
  try {
    // Realizar la solicitud para vaciar el carrito
    const response = await fetch(`/api/carts/${cartId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Carrito vaciado con éxito.");
      window.location.reload(); // Recargar la página para reflejar el carrito vacío
    } else {
      const errorData = await response.json();
      alert("Error al vaciar el carrito: " + errorData.error);
    }
  } catch (error) {
    console.error("Error al vaciar el carrito:", error);
    alert("Ocurrió un error al vaciar el carrito.");
  }
}
