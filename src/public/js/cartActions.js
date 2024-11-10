// /public/js/cartActions.js

async function removeFromCart(cartId, productId) {
  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Producto eliminado del carrito correctamente.");
      // Opcionalmente, puedes recargar la página para actualizar la lista
      window.location.reload();
    } else {
      const errorData = await response.json();
      alert(`Error al eliminar el producto: ${errorData.error}`);
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
    alert("Ocurrió un error al intentar eliminar el producto.");
  }
}
