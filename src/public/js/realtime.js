// public/js/realtime.js
document.addEventListener("DOMContentLoaded", () => {
  const socket = io({
    transports: ["websocket"], // Fuerza el uso de WebSocket solamente
  });

  const productContainer = document.getElementById("products");
  const productForm = document.getElementById("productForm");

  // Escuchar el evento 'updateProducts' y asegurarnos de que recibimos solo el array
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
    socket.emit("addProduct", newProduct);
    productForm.reset();
  });

  window.deleteProduct = (productId) => {
    socket.emit("deleteProduct", productId);
  };

  socket.on("productError", (error) => {
    alert(error.message);
  });
});
