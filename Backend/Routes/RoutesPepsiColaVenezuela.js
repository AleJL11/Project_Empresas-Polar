const Product = require("../Model/ModelPr");
const routerPv = require("express").Router();

routerPv.get("/pepsicola-venezuela", async (req, res) => {
    try {
        const productos = await Product.find({
          "categorias.nombre": "PepsiCola Venezuela",
          deleted: false,
        });
    
        if (!productos || productos.length === 0) {
          return res.status(404).json({ message: "Productos no encontrados en la categoría PepsiCola Venezuela" });
        }
    
        res.status(200).json({
          titulo: "PepsiCola Venezuela",
          productos: productos,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
      }
});

module.exports = routerPv;
