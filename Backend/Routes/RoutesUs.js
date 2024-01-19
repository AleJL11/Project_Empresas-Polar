const User = require("../Model/ModelUs");
const routesUs = require("express").Router(),
  multer = require("multer"),
  path = require("path"),
  { isValidObjectId } = require("mongoose"),
  nodemailer = require("nodemailer");

// Obtener todos los usuarios
routesUs.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const searchTerm = req.query.search;

  try {
    let query = { deleted: false };
    if (searchTerm) {
      query = {
        $and: [
          { deleted: false },
          {
            $or: [
              { nombre: { $regex: searchTerm, $options: "i" } }, // Búsqueda por nombre
              { apellido: { $regex: searchTerm, $options: "i" } }, // Búsqueda por apellido
              { correo: { $regex: searchTerm, $options: "i" } }, // Búsqueda por correo
              { rol: { $regex: searchTerm, $options: "i" } }, // Búsqueda por rol
              { nro_tlf: { $regex: searchTerm, $options: "i" } }, // Búsqueda por número de teléfono
            ],
          },
        ],
      };
    }

    // Agregar el filtro por rol
    if (req.query.rol) {
      query["rol"] = { $in: [req.query.rol] };
    }

    const totalDocs = await User.countDocuments(query); // Obtener el número total de documentos según la búsqueda
    const pageCount = Math.ceil(totalDocs / limit); // Calcular el número total de páginas

    const options = {
      page,
      limit,
    };

    const users = await User.paginate(query, options);
    res.status(200).json({ data: users.docs, meta: { totalDocs, pageCount } }); // Enviar los datos, el número total de documentos y el número total de páginas
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener usuarios", error: error.message });
  }
});

// Obtener los roles
routesUs.get("/roles", async (req, res) => {
  const roles = User.schema.paths.rol.enumValues;
  res.json({ roles });
});

// Obtener usuario según ID
routesUs.get("/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ message: "El ID del usuario debe ser un ObjectId válido GET" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener usuario por ID",
      error: error.message,
    });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/Usuarios"));
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

const imgPerfil = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Iniciar Sesión
routesUs.post("/login", async (req, res) => {
  const { correo, clave } = req.body;
  User.findOne({ correo: correo }).then((user) => {
    if (user) {
      if (user.clave === clave) {
        //res.json("Ingreso exitoso");
        res.json({ message: "Ingreso exitoso", user: user });
      } else {
        res.status(400).json({ message: "Contraseña incorrecta" });
      }
    } else {
      res.status(400).json({ message: "Usuario no encontrado" });
    }
  });
});

const sendEmailRecuperacionContrasena = (correo, idUsuario) => {
  // Crear un transportador de correo electrónico
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "alejandro020215@gmail.com",
      pass: "yrve xycv ojvu ehgx",
    },
  });

  // Crear un correo electrónico
  const mail = {
    from: "alejandro020215@gmail.com",
    to: correo,
    subject: "Recuperar contraseña",
    text: `
        Hola,
  
        Para restablecer tu contraseña, haz clic en el siguiente enlace:
  
        http://localhost:3000/olvide-contraseña?idUsuario=${idUsuario}
  
        Este enlace caducará en 24 horas.
  
        Saludos,
  
        El equipo de la aplicación Empresas Polar.
      `,
  };

  // Enviar el correo electrónico
  transporter.sendMail(mail);
};

routesUs.post("/recuperar-contrasena", async (req, res) => {
  try {
    if (!req.body.correo) {
      return res.status(400).json({ message: "Falta el campo 'correo'" });
    }

    const correo = req.body.correo;

    const user = await User.findOne({ correo });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await user.save();

    const idUsuario = user.id;

    // Enviar el correo de recuperación
    sendEmailRecuperacionContrasena(correo, idUsuario);

    res.json({
      message:
        "Se ha enviado un correo electrónico con las instrucciones para recuperar la contraseña",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al enviar el correo electrónico",
      error: error.message,
    });
  }
});

// Insertar un nuevo usuario
routesUs.post("/", imgPerfil.single("imagen"), async (req, res) => {
  try {
    if (
      !req.body.nombre ||
      !req.body.apellido ||
      !req.body.correo ||
      !req.body.clave
    ) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const {
      rol,
      nombre,
      apellido,
      correo,
      clave,
      deleted,
      cedula,
      nro_tlf,
      nro_ofi,
      nro_hab,
      direccion,
      cant_prd_registrados,
      cant_prd_vendidos,
    } = req.body;

    const urlImagen = req.file ? req.file.filename : "";

    const user = new User({
      rol,
      nombre,
      apellido,
      correo,
      clave,
      deleted,
      cedula,
      nro_tlf,
      nro_ofi,
      nro_hab,
      direccion,
      cant_prd_registrados,
      cant_prd_vendidos,
      imagen: urlImagen,
    });

    await user.save();

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al crear usuario", error: error.message });
  }
});

// Actualizar usuario
routesUs.patch("/:id", imgPerfil.single("imagen"), async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "ID de usuario no válido PATCH" });
    }

    const { nombre, apellido, cedula, correo, nro_tlf, direccion, clave } = req.body;

    // Verificar si se ha enviado una nueva imagen
    const urlImagen = req.file ? req.file.filename : undefined;

    // Construir el objeto de datos actualizados
    const updatedData = {
      nombre,
      apellido,
      cedula,
      correo,
      nro_tlf,
      direccion,
      clave,
    };

    // Agregar la imagen al objeto de datos si se proporciona
    if (urlImagen) {
      updatedData.imagen = urlImagen;
    }

    // Realizar la actualización del usuario
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar la fecha de actualización
    user.fechaActualizacion = Date.now();
    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al actualizar usuario", error: error.message });
  }
});

// Eliminar usuario
routesUs.delete("/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ message: "ID de usuario no válido DELETE" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { deleted: true }, // Establecer el campo 'deleted' en true
      { new: true } // Devolver el objeto de usuario actualizado
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al eliminar el usuario", error: error.message });
  }
});

module.exports = routesUs;
