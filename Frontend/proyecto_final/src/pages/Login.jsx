import React, { useState } from "react";

// Otros
import Cookies from "js-cookie";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

// React Router Dom
import { Link, useNavigate } from "react-router-dom";

// Iconos
import { IoIosArrowBack } from "react-icons/io";
import { FiHome } from "react-icons/fi";
import { CiLock, CiUnlock } from "react-icons/ci";

// React Bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const Login = () => {
  const history = useNavigate();
  const [correo, setCorreo] = useState(Cookies.get("correo") || "");
  const [contrasena, setContrasena] = useState("");
  const [correoError, setCorreoError] = useState("");
  const [contrasenaError, setContrasenaError] = useState("");
  const [correoEnviado, setCorreoEnviado] = useState(false);
  const regexCorreo = /^[a-zA-Z0-9._-]+@([a-zA-Z0-9.-]{2,7})+\.com$/;
  //const regexPass = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,10}$/;
  const [showPassword, setShowPassword] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState(<CiLock />);

  const {
    setRole,
    setImg,
    setUser,
    setLastName,
    setCedula,
    setUserEmail,
    setTlf,
    setDireccion,
    setClave,
    setID,
  } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setPasswordIcon(showPassword ? <CiLock /> : <CiUnlock />);
  };

  const handleGoBack = () => {
    history(-1); // Retroceder una página en la historia de navegación
  };

  const handleRecordarCorreo = () => {
    Cookies.set("correo", correo, { expires: 3 });
  };

  const correoErrores = {
    formato: "El formato del correo es inválido. Debe ser usuario@dominio.com",
    faltaArroba: "Falta el símbolo @ en el correo",
    dominioInvalido: "El dominio del correo no es válido",
  };

  const passwordErrores = {
    longitud: "La contraseña debe tener entre 8 y 10 caracteres",
    mayusculas: "La contraseña debe incluir al menos una letra mayúscula",
    numeros: "La contraseña debe incluir al menos un número",
    caracteresEspeciales:
      "La contraseña debe incluir al menos un carácter especial",
  };

  const validarCorreo = (correo) => {
    // Comprueba si el correo electrónico contiene el símbolo @
    if (!correo.includes("@")) {
      return "faltaArroba";
    }

    // Separa el correo electrónico en dos partes: el nombre de usuario y el dominio
    const parts = correo.split("@");

    // Comprueba si el dominio es válido
    if (!parts[1].includes(".com")) {
      return "dominioInvalido";
    }

    // Comprueba si el formato es válido
    return regexCorreo.test(correo) ? "" : "formato";
  };

  const validarPassword = (password) => {
    // Comprueba la longitud
    if (password.length < 8 || password.length > 10) {
      return "longitud";
    }

    // Comprueba que contiene al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) {
      return "mayusculas";
    }

    // Comprueba que contiene al menos un número
    if (!/[0-9]/.test(password)) {
      return "numeros";
    }

    // Comprueba que contiene al menos un carácter especial
    if (!/[^a-zA-Z0-9]/.test(password)) {
      return "caracteresEspeciales";
    }

    return "";
  };

  const sendEmailRecuperacionContrasena = async (correo) => {
    try {
      await axios.post("http://localhost:3001/usuarios/recuperar-contrasena", {
        correo,
      });
      console.log("Correo de recuperación enviado exitosamente");
      setCorreoEnviado(true);
    } catch (error) {
      console.error("Error al enviar el correo de recuperación", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setCorreoError("");
    setContrasenaError("");

    if (correo === "") {
      setCorreoError("El campo de correo es obligatorio");
    }

    if (contrasena === "") {
      setContrasenaError("El campo de contraseña es obligatorio");
    }

    if (correo && contrasena && !correoError && !contrasenaError) {
      try {
        // Realiza la solicitud a la API para verificar las credenciales
        await axios
          .post("http://localhost:3001/usuarios/login", {
            correo: correo,
            clave: contrasena,
          })
          .then((res) => {
            if (res.data.message === "Ingreso exitoso") {
              setID(res.data.user._id);
              setRole(res.data.user.rol);
              setImg(res.data.user.imagen);
              setUser(res.data.user.nombre);
              setLastName(res.data.user.apellido);
              setCedula(res.data.user.cedula);
              setUserEmail(res.data.user.correo);
              setTlf(res.data.user.nro_tlf);
              setDireccion(res.data.user.direccion);
              setClave(res.data.user.clave);
              history("/");
            } else {
              if (res.data.message === "Usuario no encontrado") {
                setCorreoError("Correo incorrecto");
              } else if (res.data.message === "Contraseña incorrecta") {
                setContrasenaError("Contraseña incorrecta");
              }
            }
          });
      } catch (error) {
        console.error(error);
        setCorreoError("Error al iniciar sesión, intente nuevamente");
        setContrasenaError("Error al iniciar sesión, intente nuevamente");
      }
    }
  };

  const handleOlvideContrasena = async () => {
    if (correo === "") {
      setCorreoError("El campo de correo es obligatorio");
      return;
    }

    const error = validarCorreo(correo);
    setCorreoError(error ? correoErrores[error] : "");

    if (correoError === "") {
      try {
        await sendEmailRecuperacionContrasena(correo);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <div
        className="xl:h-[12em] xl:flex xl:items-center xl:justify-center
        md:h-[12em]
        w-full h-40 rounded-[0_0_50px_50px] bg-[#E81D1D]"
      >
        <div className="grid grid-cols-1 place-items-center">
          <div className="grid place-items-center my-3">
            <p
              className="xl:text-[40px]
                lg:text-[35px]
              md:text-[40px]
              text-white text-3xl flex items-center"
            >
              {" "}
              ¡Hola, amigo!
            </p>
            <p
              className="xl:text-[33px]
                lg:text-[30px]
              md:text-[25px]
              text-white text-base"
            >
              Ingrese sus datos para poder comprar.
            </p>
            <Link
              className="xl:text-[30px]
                lg:text-[25px]
                md:text-[25px]
              text-white"
              to="/registrarse"
            >
              Registrate aqui
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full h-auto mx-auto text-center mt-4">
        <h1 className="xl:text-[50px] lg:mt-[10%] md:mt-[20%] md:text-[40px]">Iniciar Sesión</h1>
        <div className="flex flex-row justify-center">
          <p className="xl:text-[35px] lg:text-[25px] md:text-[30px] px-0">
            Si aún no tiene cuenta,
          </p>
          <Link to="/registrarse" className="xl:text-[35px] lg:text-[25px] md:text-[30px] px-0 ml-1">
            presione aquí
          </Link>
        </div>
      </div>

      <Form className="w-full mx-auto mt-2" onSubmit={handleSubmit}>
        <Form.Group
          className="xl:w-[30%] 
            lg:w-[40%] lg:mt-[3%]
            md:w-[40%] mb-3 w-[70%] mx-auto"
          controlId="formGroupEmail"
        >
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            className="min-[1920px]:w-[800px] min-[1920px]:text-[40px] xl:w-[600px] xl:h-[80px] xl:text-[30px] lg:h-[70px] lg:w-[500px] lg:text-[25px] md:mt-[10%] md:w-[450px] md:h-[70px] md:text-[25px] md:ml-[-50px] w-[280px] p-2 border border-slate-600 rounded-lg"
            onChange={(e) => {
              setCorreo(e.target.value);
              const error = validarCorreo(e.target.value);
              setCorreoError(error ? correoErrores[error] : "");
            }}
          />
          {correoError && <p className="xl:text-[30px] md:text-[25px] md:ml-[-50px] text-red-500">{correoError}</p>}
        </Form.Group>
        <Form.Group
          className="xl:w-[30%]
          lg:mt-[3%]
            md:w-[40%] mb-3 w-[70%] mx-auto"
          controlId="formGroupPassword"
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={contrasena}
            className="min-[1920px]:w-[800px] min-[1920px]:text-[40px]  xl:w-[600px] xl:h-[80px] xl:text-[30px] lg:h-[70px] lg:w-[500px] lg:text-[25px] md:mt-[10%] md:w-[450px] md:h-[70px] md:text-[25px] md:ml-[-50px] w-[280px] p-2 border border-slate-600 rounded-lg"
            onChange={(e) => {
              setContrasena(e.target.value);
              const error = validarPassword(e.target.value);
              setContrasenaError(error ? passwordErrores[error] : "");
            }}
          />
          <button
            className="min-[2530px]:-ml-20 min-[2530px]:mt-24 min-[2240px]:mt-[-62px] min-[1920px]:-mt-16 min-[1860px]:-ml-20 min-[1860px]:mt-20 min-[1920px]:ml-[650px] xl:-mt-16 xl:ml-[500px] lg:-mt-14 lg:ml-[450px] lg:text-[40px] md:ml-[350px] md:text-[40px] md:-mt-14 absolute -mt-8 ml-[250px] text-xl"
            onClick={togglePasswordVisibility}
          >
            {passwordIcon}
          </button>
          {contrasenaError && <p className="xl:text-[30px] md:text-[25px] md:ml-[-50px]  text-red-500">{contrasenaError}</p>}
        </Form.Group>
        {correoEnviado && (
          <p className="text-green-500 text-center mx-auto mt-2 w-[80%]">
            Se envió un correo para la recuperación de la contraseña
          </p>
        )}
        <div className="lg:mt-[5%] w-[95%] h-auto mx-auto">
          <div className="grid grid-cols-1 place-items-center">
            <Button type="submit" variant="danger" className="xl:w-[400px] lg:w-[300px] md:w-[300px] mb-[1rem] w-48">
              <span className="xl:text-[40px] lg:text-[30px] md:text-[30px]">Iniciar Sesión</span>
            </Button>
            <div className="mt-[1rem] flex flex-row">
              <Button
                variant="outline-secondary"
                className="xl:w-[400px] lg:w-[300px] md:w-[300px] mr-4"
                onClick={handleRecordarCorreo}
              >
                <span className="xl:text-[40px] lg:text-[30px] md:text-[30px]">Recordar correo</span>
              </Button>
              <Button
                variant="outline-secondary"
                className="xl:w-[400px] lg:w-[300px] md:w-[300px]"
                onClick={handleOlvideContrasena}
              >
                <span className="xl:text-[40px] lg:text-[30px] md:text-[30px]">Olvidé mi contraseña</span>
              </Button>
            </div>
          </div>
        </div>
      </Form>
          
      <div
        className="xl:mt-[6%] md:mt-[8%]
        lg:mt-[13%] w-full h-[65px] flex justify-content-between align-items-center mt-16"
      >
        <IoIosArrowBack
          className="lg:text-[60px] md:text-[60px] mt-1 ml-4 mb-2 text-3xl"
          onClick={handleGoBack}
        />
        <Link to="/">
          <FiHome className="lg:text-[60px] md:text-[60px] text-black text-2xl mr-5" />
        </Link>
      </div>
    </>
  );
};
