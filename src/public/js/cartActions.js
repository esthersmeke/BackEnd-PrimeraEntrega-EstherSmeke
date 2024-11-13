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

// Agregar un producto al carrito
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

// Actualizar la cantidad de un producto en el carrito
async function updateProductQuantity(cartId, productId) {
  const quantityInput = document.getElementById(`quantity-${productId}`);
  const newQuantity = parseInt(quantityInput.value);

  try {
    // Realizar la solicitud para actualizar la cantidad del producto
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    if (response.ok) {
      alert("Cantidad actualizada exitosamente.");
      window.location.reload(); // Recargar la página para reflejar la actualización
    } else {
      const errorData = await response.json();
      alert("Error al actualizar la cantidad: " + errorData.error);
    }
  } catch (error) {
    console.error("Error al actualizar la cantidad del producto:", error);
    alert("Ocurrió un error al actualizar la cantidad del producto.");
  }
}

// Eliminar un producto del carrito
async function deleteProductFromCart(cartId, productId) {
  try {
    // Realizar la solicitud para eliminar el producto del carrito
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Producto eliminado del carrito con éxito.");
      window.location.reload(); // Recargar la página para reflejar la eliminación
    } else {
      const errorData = await response.json();
      alert("Error al eliminar el producto del carrito: " + errorData.error);
    }
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error);
    alert("Ocurrió un error al eliminar el producto del carrito.");
  }
}
