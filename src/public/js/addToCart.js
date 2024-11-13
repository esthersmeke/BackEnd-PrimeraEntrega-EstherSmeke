function addToCart(cartId, productId) {
  // Validar que productId no esté indefinido
  if (!productId) {
    console.error("Error: El productId es undefined.");
    alert(
      "Error: No se pudo agregar el producto porque el ID del producto no es válido."
    );
    return;
  }

  // Realizar la solicitud para agregar el producto al carrito
  fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity: 1 }),
  })
    .then((response) => {
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error("Error al agregar el producto al carrito");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Producto agregado al carrito:", data);
      alert("Producto agregado al carrito exitosamente!");
    })
    .catch((error) => {
      console.error("Error al agregar el producto:", error);
      alert("Hubo un error al agregar el producto al carrito.");
    });
}
