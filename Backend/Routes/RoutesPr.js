const Product = require("../Model/ModelPr"),
  User = require("../Model/ModelUs"),
  routerPr = require("express").Router(),
  multer = require("multer"),
  path = require("path"),
  fs = require("fs"),
  { isValidObjectId } = require("mongoose");

// Obtener las categorias y subcategorias
routerPr.get("/categorias", async (req, res) => {
  try {
    const categoriasConSubcategorias = {};

    const categoriasValidas = {
      "Alimentos Polar": [
        "Salsas y Untables",
        "Cereales",
        "Aceites",
        "Granos y Leguminosas",
        "Modificadores Lacteos",
        "Yogurt",
        "Galletas y Postres",
        "Bebidas y Alimentos en polvo",
        "Proteinas",
        "Limpieza",
        "Mascotas",
      ],
      "PepsiCola Venezuela": [
        "Bebidas Carbonatadas",
        "Bebidas No Carbonatadas",
      ],
      "Cerveceria Polar": ["Cerveza", "Malta", "Vinos", "Sangría"],
    };

    for (const categoria in categoriasValidas) {
      if (!categoriasConSubcategorias[categoria]) {
        categoriasConSubcategorias[categoria] = categoriasValidas[categoria];
      }
    }

    res.json(categoriasConSubcategorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos los productos
routerPr.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const searchTerm = req.query.search;

  try {
    let query = { deleted: false };
    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm);
      query = {
        $and: [
          { deleted: false },
          {
            $or: [
              { nombre: searchRegex },
              {
                "categorias.nombre": { $regex: searchRegex, $options: "i" },
              },
              {
                "categorias.subcategorias": {
                  $regex: searchRegex,
                  $options: "i",
                },
              },
            ],
          },
        ],
      };
    }

    const totalDocs = await Product.countDocuments(query);
    const pageCount = Math.ceil(totalDocs / limit);

    const options = {
      page,
      limit,
    };

    const products = await Product.paginate(query, options);
    res
      .status(200)
      .json({ data: products.docs, meta: { totalDocs, pageCount } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Obtener los productos por ID
routerPr.get("/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "ID de producto no válido" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const categoriasValidas = {
      "Alimentos Polar": [
        "Salsas y Untables",
        "Cereales",
        "Aceites",
        "Granos y Leguminosas",
        "Modificadores Lacteos",
        "Yogurt",
        "Galletas y Postres",
        "Bebidas y Alimentos en polvo",
        "Proteinas",
        "Limpieza",
        "Mascotas",
      ],
      "PepsiCola Venezuela": [
        "Bebidas Carbonatadas",
        "Bebidas No Carbonatadas",
      ],
      "Cerveceria Polar": ["Cerveza", "Malta", "Vinos", "Sangría"],
    };

    const allCategories = Object.keys(categoriasValidas).map((categoria) => {
      return {
        nombre: categoria,
        subcategorias: categoriasValidas[categoria],
      };
    });

    res.status(200).json({ product, allCategories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/Productos"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    const error = new Error("Tipo de archivo no soportado");
    error.status = 400;
    cb(error);
  }
};

const imgProductos = multer({
  storage: storage,
  fileFilter: fileFilter,
});

routerPr.post("/", imgProductos.single("imagen"), async (req, res) => {
  try {
    if (req.file) {
      const { vendedor, nombre, precio, inventario, descripcion } = req.body;
      const urlImagen = req.file.filename;
      let categorias = JSON.parse(req.body.categorias);

      const [nombreVendedor, apellidoVendedor] = vendedor.split(" ");

      const vendedorUsuario = await User.findOne({
        nombre: nombreVendedor,
        apellido: apellidoVendedor,
        deleted: false,
      });

      if (!vendedorUsuario) {
        return res.status(400).json({ message: "Vendedor no encontrado" });
      }

      const product = new Product({
        vendedor: `${nombreVendedor} ${apellidoVendedor}`,
        nombre,
        precio,
        inventario,
        imagen: urlImagen,
        descripcion,
        categorias,
      });

      await product.save();
      res.status(201).json(product);
    } else {
      res.status(400).json({ message: "No se ha cargado ningún archivo" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un producto
routerPr.patch("/:id", imgProductos.single("imagen"), async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "ID de producto no válido" });
    }

    const { vendedor, nombre, precio, inventario, descripcion } = req.body;
    const categorias = JSON.parse(req.body.categorias);

    const [nombreVendedor, apellidoVendedor] = vendedor.split(" ");

    const userVendedor = await User.findOne({
      nombre: nombreVendedor,
      apellido: apellidoVendedor,
      deleted: false,
    });

    if (!userVendedor) {
      return res.status(400).json({
        message:
          "El nombre y apellido del vendedor no coinciden con un usuario existente",
      });
    }

    // Verifica si se ha subido un archivo
    if (req.file) {
      const urlImagen = req.file ? req.file.filename : "";

      // Actualiza tanto los datos como la imagen
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          vendedor: `${nombreVendedor} ${apellidoVendedor}`,
          nombre,
          precio,
          inventario,
          descripcion,
          imagen: urlImagen,
          categorias,
        },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.json(product);
    } else {
      // Si no se ha subido un archivo, realiza la actualización sin la imagen
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          vendedor: `${nombreVendedor} ${apellidoVendedor}`,
          nombre,
          precio,
          inventario,
          descripcion,
          categorias,
        },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.json(product);
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message });
  }
});

routerPr.patch("/cantidad/:id", async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      {
        cantidad: cantidad,
      },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error al actualizar la cantidad del producto:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar la cantidad del producto" });
  }
});

routerPr.patch("/vendedor/:id", async (req, res) => {
  let vendedor;
  try {
    const { id } = req.params;
    vendedor = req.body.vendedor;
    const [nombreVendedor, apellidoVendedor] = vendedor.split(" ");

    const userVendedor = await User.findOne({
      nombre: nombreVendedor,
      apellido: apellidoVendedor,
      deleted: false,
    });

    if (!userVendedor) {
      return res.status(400).json({
        message:
          "El nombre y apellido del vendedor no coinciden con un usuario existente",
      });
    }

    const updatedProduct = {
      vendedor: `${nombreVendedor} ${apellidoVendedor}`,
    };

    const product = await Product.findByIdAndUpdate(id, updatedProduct, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error al actualizar el vendedor del producto:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar el vendedor del producto" });
  }
});

// Eliminar un producto
routerPr.delete("/:id", async (req, res) => {
  /*try {
    let product = await Product.deleteOne({ _id: req.params.id });
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }*/
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "ID de producto no válido" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { deleted: true }, // Establecer el campo 'deleted' en true
      { new: true } // Devolver el objeto de usuario actualizado
    );

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al eliminar el producto", error: error.message });
  }
});

module.exports = routerPr;
