// public/js/realtime.js

document.addEventListener("DOMContentLoaded", () => {
  // Establecer conexión con el servidor usando WebSocket
  const socket = io({
    transports: ["websocket"], // Fuerza el uso de WebSocket solamente
  });

  const productContainer = document.getElementById("products");
  const productForm = document.getElementById("productForm");

  // Escuchar el evento 'updateProducts' para actualizar la lista de productos
  socket.on("updateProducts", (products) => {
    console.log("Productos recibidos en el cliente:", products);

    if (Array.isArray(products)) {
      productContainer.innerHTML = "";
      products.forEach((product) => {
        productContainer.innerHTML += `
          <li>
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <p>Código: ${product.code}</p>
            <p>Precio: ${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <p>Categoría: ${product.category}</p>
            <button onclick="deleteProduct('${product._id}')">Eliminar</button>
          </li>
        `;
      });
    } else {
      console.error("Error: La lista de productos no es un array:", products);
    }
  });

  // Manejar el envío del formulario para agregar un nuevo producto
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newProduct = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      code: document.getElementById("code").value,
      price: parseFloat(document.getElementById("price").value),
      stock: parseInt(document.getElementById("stock").value),
      category: document.getElementById("category").value,
    };
    socket.emit("addProduct", newProduct); // Emitir evento para agregar producto
    productForm.reset(); // Limpiar el formulario después de enviarlo
  });

  // Función para eliminar un producto específico
  window.deleteProduct = (productId) => {
    socket.emit("deleteProduct", productId);
  };

  // Escuchar el evento de error de producto y mostrar una alerta
  socket.on("productError", (error) => {
    alert(error.message);
  });
});
