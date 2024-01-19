const Product = require("../Model/ModelPr");
const routerAp = require("express").Router();

routerAp.get("/alimentos-polar", async (req, res) => {
  try {
    const productos = await Product.find({
      "categorias.nombre": "Alimentos Polar",
      deleted: false,
    });

    if (!productos || productos.length === 0) {
      return res
        .status(404)
        .json({
          message: "Productos no encontrados en la categoría Alimentos Polar",
        });
    }

    res.status(200).json({
      titulo: "Alimentos Polar",
      productos: productos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = routerAp;
