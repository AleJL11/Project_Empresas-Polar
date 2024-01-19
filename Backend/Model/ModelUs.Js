const mongoose = require("mongoose"),
      Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

// Esquema
const UserSchema = new Schema({
  rol: {
    type: String,
    validate: {
      validator: (value) => /^[a-zA-Z0-9 ]+$/.test(value),
      message: "El campo de rol debe contener solo letras, números y espacios.",
    },
    default: "cliente",
    enum: ["cliente", "administrador", "vendedor"],
  },
  cedula: {
    type: String,
    validate: {
      validator: (value) => /^(V-|E-)\d{1,8}$/.test(value),
      message: "La cedula debe contener solo letras, números y espacios.",
    },
  },
  nro_tlf: {
    type: String,
    validate: {
      validator: (value) =>
        /^(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value),
      message: "El número de teléfono no cumple con el formato requerido.",
    },
  },
  nro_ofi: {
    type: String,
    validate: {
      validator: (value) =>
        /^(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value),
      message: "El numero de oficina no cumple con el formato requerido.",
    },
  },
  nro_hab: {
    type: String,
    validate: {
      validator: (value) =>
        /^(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value),
      message: "El numero de habitacion no cumple con el formato requerido.",
    },
  },
  direccion: {
    type: String,
    validate: {
      validator: (value) => /^[a-zA-Z0-9 ]+$/.test(value),
      message: "La dirección solo puede contener letras, números y espacios.",
    },
  },
  nombre: {
    type: String,
    validate: {
      validator: (value) => /^[a-zA-Z ]+$/.test(value),
      message:
        "El campo de nombre debe contener solo letras y espacios.",
    },
  },
  apellido: {
    type: String,
    validate: {
      validator: (value) => /^[a-zA-Z ]+$/.test(value),
      message:
        "El campo de apellido debe contener solo letras y espacios.",
    },
  },
  correo: {
    type: String,
    validate: {
      validator: (value) =>
        /^[a-zA-Z0-9._-]+@([a-zA-Z0-9.-]{2,7})+\.com$/.test(value),
      message: "El correo electrónico no es válido.",
    },
    unique: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  clave: {
    type: String,
    validate: {
      validator: (value) =>
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,10}$/.test(value),
      message:
        "La clave debe contener al menos una letra, un número y un caracter especial.",
    },
  },
  imagen: {
    type: String,
  },
  cant_prd_registrados: {
    type: Number,
    default: 0,
  },
  cant_prd_vendidos: {
    type: Number,
    default: 0,
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

// Middleware para actualizar la fecha Actualización cada vez que se modifica el documento
UserSchema.pre("save", function (next) {
  this.fechaActualizacion = Date.now();
  next();
});

// Aplica el plugin para la paginación
UserSchema.plugin(mongoosePaginate);

// Modelo
const User = mongoose.model("Usuario", UserSchema);

module.exports = User;
