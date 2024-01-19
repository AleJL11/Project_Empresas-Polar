const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

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
  "PepsiCola Venezuela": ["Bebidas Carbonatadas", "Bebidas No Carbonatadas"],
  "Cerveceria Polar": ["Cerveza", "Malta", "Vinos", "Sangría"],
};

// Esquema principal
const ProductSchema = new Schema({
  vendedor: {
    type: String,
    required: [true, "El nombre y apellido del vendedor son obligatorios."],
  },
  nombre: {
    type: String,
    minlength: 1,
    maxlength: 100,
    validate: {
      validator: (value) => /^[a-zA-Z0-9 .-]+$/.test(value),
      message: "El nombre solo puede contener letras, espacios, puntos y guiones.",
    },
    required: [true, "El nombre del producto es obligatorio."],
  },
  categorias: {
    type: [{
      nombre: {
        type: String,
        enum: Object.keys(categoriasValidas),
        required: true
      },
      subcategorias: [{
        type: String,
        validate: {
          validator: function(subcategoria) {
            return categoriasValidas[this.nombre].includes(subcategoria);
          },
          message: props => `${props.value} no es una subcategoría válida para la categoría ${this.nombre}`
        },
        required: true
      }]
    }],
    validate: {
      validator: function(value) {
        return value.every(categoria => {
          return categoriasValidas.hasOwnProperty(categoria.nombre) &&
            categoria.subcategorias.every(subcategoria => categoriasValidas[categoria.nombre].includes(subcategoria));
        });
      },
      message: 'Una o más categorías o subcategorías no son válidas.'
    },
    required: true
  },
  precio: {
    type: Number,
    min: [0, "El precio no puede ser negativo."],
    required: [true, "El precio del producto es obligatorio."],
  },
  inventario: {
    type: Number,
    min: [0, "El inventario no puede ser negativo."],
    required: [true, "El inventario del producto es obligatorio."],
  },
  imagen: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    validate: {
      validator: (value) => /^[a-zA-Z0-9 .,!?¿%]+$/.test(value),
      message: "La descripción solo puede contener letras, números, puntos, comas, porcentaje, signos de interrogación y exclamación.",
    },
    required: [true, "La descripción es obligatoria."],
  },
  cantidad: {
    type: Number,
    min: [0, "La cantidad no puede ser negativa."],
    //required: [true, "La cantidad es obligatoria."],
    default: 0,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para actualizar la fecha de actualización cada vez que se modifica el documento
ProductSchema.pre("save", function (next) {
  this.fechaActualizacion = Date.now();
  next();
});

// Aplica el plugin para la paginación
ProductSchema.plugin(mongoosePaginate);

// Modelo
const Product = mongoose.model("Producto", ProductSchema);

// Exportar el modelo
module.exports = Product;