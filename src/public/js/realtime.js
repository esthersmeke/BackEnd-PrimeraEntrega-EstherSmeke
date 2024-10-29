document.addEventListener("DOMContentLoaded", () => {
  const socket = io("http://localhost:8080");
  const productContainer = document.getElementById("products");
  const productForm = document.getElementById("productForm");

  socket.on("productList", (products) => {
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
          <p>Status: ${product.status ? "Disponible" : "No disponible"}</p>
          <p>Thumbnails: ${product.thumbnails
            .map((thumbnail) => `<span>${thumbnail}</span>`)
            .join("")}</p>
          <button onclick="deleteProduct('${product.id}')">Eliminar</button>
        </li>
      `;
    });
  });

  productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newProduct = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      price: parseFloat(document.getElementById("price").value),
      stock: parseInt(document.getElementById("stock").value),
      category: document.getElementById("category").value,
      code: document.getElementById("code").value,
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
