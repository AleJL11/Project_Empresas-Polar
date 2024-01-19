const express = require("express"),
  app = express(),
  port = 3001,
  mongoose = require("mongoose"),
  cors = require("cors");

/*
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
*/

/* Mongoose */
try {
  mongoose.connect("mongodb://127.0.0.1:27017/ProyectoFinal");
} catch (error) {
  console.log(error);
}

/* CORS */
const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

/* JSON */
app.use(express.json());
//app.use(express.static("public"));
/*app.use("/AlimentosPolar", express.static(__dirname + "/public/AlimentosPolar"));
app.use("/CerveceriaPolar", express.static(__dirname + "/public/CerveceriaPolar"));
app.use("/PepsiCola", express.static(__dirname + "/public/PepsiCola"));*/
app.use("/Usuarios", express.static(__dirname + "/public/Usuarios"));
app.use("/Productos", express.static(__dirname + "/public/Productos"));

/* ROUTES */
const RoutesUsuarios = require("./Routes/RoutesUs");
const RoutesProductos = require("./Routes/RoutesPr");
const RoutesVentas = require("./Routes/RoutesVn");
const RoutesReportes = require("./Routes/RoutesRp");
const RoutesAlimentosPolar = require("./Routes/RoutesAlimentosPolar");
const RoutesCerveceriaPolar = require("./Routes/RoutesCerveceriaPolar");
const RoutesPepsiColaVenezuela = require("./Routes/RoutesPepsiColaVenezuela");
const RouteCorrelativo = require("./Routes/RouteCorrelativo");

/* Indicar las rutas principales */
app.use("/usuarios", RoutesUsuarios);
app.use("/productos", RoutesProductos);
app.use("/ventas", RoutesVentas);
app.use("/reportes", RoutesReportes);
app.use(RoutesAlimentosPolar);
app.use(RoutesCerveceriaPolar);
app.use(RoutesPepsiColaVenezuela);
app.use(RouteCorrelativo);

/* Indicar el puerto */
app.listen(port, () => {
  console.log(port);
});

mongoose.set("debug", true);
