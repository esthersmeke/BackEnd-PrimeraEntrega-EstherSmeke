export const configureSocket = (io, productManager) => {
  io.on("connection", (socket) => {
    console.log("Cliente conectado");

    // Evento para agregar un nuevo producto
    socket.on("addProduct", async (newProduct) => {
      try {
        // Validación de los campos obligatorios
        const requiredFields = [
          "title",
          "description",
          "price",
          "stock",
          "category",
          "code",
        ];
        const hasAllFields = requiredFields.every(
          (field) => newProduct[field] !== undefined && newProduct[field] !== ""
        );

        if (!hasAllFields) {
          socket.emit("productError", {
            message:
              "Todos los campos son obligatorios (title, description, price, stock, category, code)",
          });
          return;
        }

        // Validación adicional: asegurar que el precio y el stock sean números válidos
        if (isNaN(newProduct.price) || newProduct.price <= 0) {
          socket.emit("productError", {
            message: "El precio debe ser un número mayor a 0",
          });
          return;
        }

        if (isNaN(newProduct.stock) || newProduct.stock < 0) {
          socket.emit("productError", {
            message: "El stock debe ser un número igual o mayor a 0",
          });
          return;
        }

        // Validación de código único (No debe repetirse)
        const existingProduct = await productManager.getProductByCode(
          newProduct.code
        );
        if (existingProduct) {
          socket.emit("productError", {
            message: "El código del producto debe ser único",
          });
          return;
        }

        // Si pasa todas las validaciones, agregar el producto
        await productManager.addProduct(newProduct);

        // Obtener la lista de productos actualizada y emitirla a todos los clientes
        const updatedProducts = await productManager.getProducts();
        io.emit("updateProducts", updatedProducts);
      } catch (error) {
        console.error("Error al agregar el producto:", error.message);
        socket.emit("productError", {
          message:
            "Hubo un error al agregar el producto. Inténtalo de nuevo más tarde.",
        });
      }
    });

    // Evento para eliminar un producto
    socket.on("deleteProduct", async (productId) => {
      try {
        await productManager.deleteProduct(productId);

        // Obtener la lista de productos actualizada y emitirla a todos los clientes
        const updatedProducts = await productManager.getProducts();
        io.emit("updateProducts", updatedProducts);
      } catch (error) {
        console.error("Error al eliminar el producto:", error.message);
        socket.emit("productError", {
          message:
            "Hubo un error al eliminar el producto. Inténtalo de nuevo más tarde.",
        });
      }
    });

    // Evento de desconexión del cliente
    socket.on("disconnect", () => {
      console.log("Cliente desconectado");
    });
  });
};
