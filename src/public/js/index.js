const socket = io();

// Enviar nuevo producto al servidor
document
  .getElementById("productForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const newProduct = {
      title: document.getElementById("title").value,
      price: parseFloat(document.getElementById("price").value),
      code: document.getElementById("code").value,
      stock: parseInt(document.getElementById("stock").value),
      category: document.getElementById("category").value,
    };

    socket.emit("addProduct", newProduct);
    this.reset();
  });

// Eliminar producto
function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}

// Actualizar la lista de productos cuando se reciba un nuevo producto
socket.on("updateProductList", (products) => {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <strong>${product.title}</strong> - $${product.price}
            <button onclick="deleteProduct(${product.id})">Eliminar</button>
        `;
    productList.appendChild(li);
  });
});
