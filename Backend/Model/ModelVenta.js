const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const ProductoVentaSchema = new Schema({
  producto: {
    type: Schema.Types.ObjectId,
    ref: "Productos",
    required: true,
  },
  precioUnitario: {
    type: Number,
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const VentaSchema = new Schema({
  cliente: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  vendedor: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  numeroFactura: {
    type: String,
    unique: true,
  },
  productos: [ProductoVentaSchema],
  deleted: {
    type: Boolean,
    default: false,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

VentaSchema.pre("save", async function (next) {
  this.fechaCreacion = Date.now();
  if (!this.numeroFactura) {
    let lastVenta = await this.constructor.findOne({}, {}, { sort: { numeroFactura: -1 } });
    let numeroFactura = lastVenta ? parseInt(lastVenta.numeroFactura) + 1 : 1;
    this.numeroFactura = numeroFactura.toString().padStart(7, "0");
  }
  next();
});

// Aplica el plugin para la paginación
VentaSchema.plugin(mongoosePaginate);

VentaSchema.virtual("precioTotal").get(function () {
  return this.precioUnitario * this.cantidad;
});

module.exports = mongoose.model("Venta", VentaSchema);
