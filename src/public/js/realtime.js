document.addEventListener("DOMContentLoaded", () => {
  const socket = io({
    transports: ["websocket"], // Fuerza el uso de WebSocket solamente
  }); // Aquí se establece la conexión con el servidor WebSocket

  // Añadir el mensaje para confirmar la conexión con el servidor WebSocket
  socket.on("connect", () => {
    console.log("Conectado al servidor WebSocket");
  });

  const productContainer = document.getElementById("products");
  const productForm = document.getElementById("productForm");

  socket.on("productList", (products) => {
    productContainer.innerHTML = "";
    products.forEach((product) => {
      productContainer.innerHTML += `
        <li>
          <h2>${product.title}</h2>
          <p>${product.description}</p>
          <p>Precio: ${product.price}</p>
          <p>Stock: ${product.stock}</p>
          <p>Categoría: ${product.category}</p>
          <button onclick="deleteProduct('${product.id}')">Eliminar</button>
        </li>
      `;
    });
  });

  productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newProduct = {
      code: document.getElementById("code").value,
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      price: parseFloat(document.getElementById("price").value),
      stock: parseInt(document.getElementById("stock").value),
      category: document.getElementById("category").value,
    };
    socket.emit("newProduct", newProduct);
    productForm.reset();
  });

  window.deleteProduct = (productId) => {
    socket.emit("deleteProduct", productId);
  };

  // Manejar errores desde el servidor
  socket.on("error", (error) => {
    alert(error.message);
  });
});
