const Venta = require("../Model/ModelVenta");
const routerCr = require("express").Router();

routerCr.get("/correlativo", async (req, res) => {
  try {
    const ultimaVenta = await Venta.findOne(
      {},
      {},
      { sort: { numeroFactura: -1 } }
    );
    let correlativo = "00000001";

    if (ultimaVenta) {
      const ultimoNumeroFactura = ultimaVenta.numeroFactura.toString();
      const nuevoNumeroFactura = (parseInt(ultimoNumeroFactura, 10) + 1)
        .toString()
        .padStart(7, "0");
      correlativo = nuevoNumeroFactura;
    }

    res.status(200).json({ correlativo });
  } catch (error) {
    console.error("Error al obtener el correlativo de factura:", error);
    res
      .status(500)
      .json({ message: "Error al obtener el correlativo de factura" });
  }
});

module.exports = routerCr;
