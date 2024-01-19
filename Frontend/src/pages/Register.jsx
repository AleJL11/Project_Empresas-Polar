import React, { useState } from "react";

// Otros
import axios from "axios";

// React Router Dom
import { Link } from "react-router-dom";

// Iconos
import { IoIosArrowBack } from "react-icons/io";
import { FiHome } from "react-icons/fi";
import { CiLock, CiUnlock } from "react-icons/ci";

// React Bootstrap
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export const Register = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [nombreError, setNombreError] = useState("");
  const [apellidoError, setApellidoError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contrasenaError, setContrasenaError] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState(<CiLock />);

  const regexNombreApellido = /^[a-zA-Z ]+$/;
  const regexCorreo = /^[a-zA-Z0-9._-]+@([a-zA-Z0-9.-]{2,7})+\.com$/;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setPasswordIcon(showPassword ? <CiLock /> : <CiUnlock />);
  };

  const nombreErrores = {
    formato:
      "El formato del nombre es inválido. Solo se admiten letras y espacios",
    vacio: "El nombre no puede estar vacío",
  };

  const apellidoErrores = {
    formato:
      "El formato del apellido es inválido. Solo se admiten letras y espacios",
    vacio: "El apellido no puede estar vacío",
  };

  const emailErrores = {
    formato: "El formato del correo es inválido. Debe ser usuario@dominio.com",
    faltaArroba: "Falta el símbolo @ en el correo",
    dominioInvalido: "El dominio del correo no es válido",
  };

  const claveErrores = {
    longitud: "La contraseña debe tener entre 8 y 10 caracteres",
    mayusculas: "La contraseña debe incluir al menos una letra mayúscula",
    numeros: "La contraseña debe incluir al menos un número",
    caracteresEspeciales:
      "La contraseña debe incluir al menos un carácter especial",
  };

  const validarNombre = (nombre) => {
    if (nombre.trim() === "") {
      return "vacio";
    }
    return regexNombreApellido.test(nombre) ? "" : "formato";
  };

  const validarApellido = (apellido) => {
    if (apellido.trim() === "") {
      return "vacio";
    }
    return regexNombreApellido.test(apellido) ? "" : "formato";
  };

  const validarCorreo = (correo) => {
    if (!correo.includes("@")) {
      return "faltaArroba";
    }
    const parts = correo.split("@");
    if (!parts[1].includes(".com")) {
      return "dominioInvalido";
    }
    return regexCorreo.test(correo) ? "" : "formato";
  };

  const validarPassword = (contrasena) => {
    if (contrasena.length < 8 || contrasena.length > 10) {
      return "longitud";
    }
    if (!/[A-Z]/.test(contrasena)) {
      return "mayusculas";
    }
    if (!/[0-9]/.test(contrasena)) {
      return "numeros";
    }
    if (!/[^a-zA-Z0-9]/.test(contrasena)) {
      return "caracteresEspeciales";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      nombre &&
      apellido &&
      email &&
      contrasena &&
      !nombreError &&
      !apellidoError &&
      !emailError &&
      !contrasenaError
    ) {
      try {
        const nombre = e.target?.nombre?.value;
        const apellido = e.target?.apellido?.value;
        const correo = e.target?.correo?.value;
        const clave = e.target?.clave?.value;
        const repetirClave = e.target?.repetirClave?.value;

        if (clave !== repetirClave) {
          alert("Las contraseñas no coinciden");
          return;
        }

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("apellido", apellido);
        formData.append("correo", correo);
        formData.append("clave", clave);

        const response = await axios.post(
          "http://localhost:3001/usuarios",
          formData
        );

        console.log(response.data);

        setRegistroExitoso(true);
      } catch (error) {
        if (error.response) {
          console.error("Error al registrar usuario:", error.response.data);
          alert("Error al registrar usuario: " + error.response.data.message);
        } else if (error.request) {
          console.error("Error de red, no se recibió respuesta del servidor");
          alert("Error de red, no se recibió respuesta del servidor");
        } else {
          console.error("Error al realizar la solicitud:", error.message);
          alert("Error al realizar la solicitud: " + error.message);
        }
      }
    }
  };

  return (
    <>
        <div className="w-full h-40 rounded-[0_0_50px_50px] bg-blue-600">
          <div className="grid grid-cols-1 place-items-center">
            <div className="grid place-items-center my-3">
              <p className="text-white text-3xl flex items-center">
                {" "}
                ¡Bienvenido!
              </p>
              <p className="text-white text-base">
                Regístrese con sus datos para poder comprar.
              </p>
              <Link className="text-white" to="/iniciar-sesion">
                Iniciar Sesión aquí
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full h-auto mx-auto text-center mt-2">
          <h1>Crea una cuenta</h1>
          <div className="flex flex-row justify-center">
            <p className="px-0">Si ya tiene cuenta,</p>
            <Link to="/iniciar-sesion" className="px-0 ml-1">
              presione aquí
            </Link>
          </div>
        </div>

        <Form className="w-[60%] ml-[20%] mt-2" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formGroupNombre">
            <Form.Control
              type="text"
              placeholder="Nombre"
              className="w-[50%]"
              name="nombre"
              onChange={(e) => {
                setNombre(e.target.value);
                const error = validarNombre(e.target.value);
                setNombreError(error ? nombreErrores[error] : "");
              }}
            />
            {nombreError && <p className="text-red-500">{nombreError}</p>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupApellido">
            <Form.Control
              type="text"
              placeholder="Apellido"
              className="w-[50%]"
              name="apellido"
              onChange={(e) => {
                setApellido(e.target.value);
                const error = validarApellido(e.target.value);
                setApellidoError(error ? apellidoErrores[error] : "");
              }}
            />
            {apellidoError && <p className="text-red-500">{apellidoError}</p>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupCorreo">
            <Form.Control
              type="email"
              placeholder="Correo"
              className="w-[50%]"
              name="correo"
              onChange={(e) => {
                setEmail(e.target.value);
                const error = validarCorreo(e.target.value);
                setEmailError(error ? emailErrores[error] : "");
              }}
            />
            {emailError && <p className="text-red-500">{emailError}</p>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupClave">
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              className="w-[50%]"
              name="clave"
              onChange={(e) => {
                setContrasena(e.target.value);
                const error = validarPassword(e.target.value);
                setContrasenaError(error ? claveErrores[error] : "");
              }}
            />
            <button
              className="absolute -mt-7 ml-48 text-xl"
              onClick={togglePasswordVisibility}
            >
              {passwordIcon}
            </button>
            {contrasenaError && (
              <p className="text-red-500">{contrasenaError}</p>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupRepetirClave">
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Repetir Contraseña"
              className="w-[50%]"
              name="repetirClave"
            />
          </Form.Group>
          <button
              className="absolute -mt-12 ml-48 text-xl"
              onClick={togglePasswordVisibility}
            >
              {passwordIcon}
            </button>
          {registroExitoso && (
            <div className="w-full h-auto mx-auto text-center">
              <p className="text-green-500">Registro Exitoso</p>
              <Link to="/iniciar-sesion">Por favor ingrese aquí</Link>
            </div>
          )}
          <div className="w-[95%] h-auto mx-auto mt-4">
            <div className="grid grid-cols-1 place-items-center">
              <Button className="mb-[1rem] w-48 bg-blue-600" type="submit">
                Crear
              </Button>
            </div>
          </div>
        </Form>

        <div className="w-full flex justify-content-between align-items-center">
          <IoIosArrowBack className="mt-1 ml-4 mb-2 text-3xl" />
          <Link to="/" >
            <FiHome className="text-black text-2xl mr-5" />
          </Link>
        </div>
    </>
  )
};
