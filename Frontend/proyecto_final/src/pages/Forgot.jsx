import React, { useState } from "react";

// Otros
import axios from "axios";

// React Router Dom
import { Link, useNavigate } from "react-router-dom";

// Iconos
import { IoIosArrowBack } from "react-icons/io";
import { FiHome } from "react-icons/fi";
import { CiLock, CiUnlock } from "react-icons/ci";

// React Bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const Forgot = () => {
  const history = useNavigate();
  const idUsuario = window.location.search.substring(1).split("=")[1];

  const [contrasena, setContrasena] = useState("");
  const [repetirContrasena, setRepetirContrasena] = useState("");
  const [contrasenaError, setContrasenaError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState(<CiLock />);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setPasswordIcon(showPassword ? <CiLock /> : <CiUnlock />);
  };

  const passwordErrores = {
    longitud: "La contraseña debe tener entre 8 y 10 caracteres",
    mayusculas: "La contraseña debe incluir al menos una letra mayúscula",
    numeros: "La contraseña debe incluir al menos un número",
    caracteresEspeciales:
      "La contraseña debe incluir al menos un carácter especial",
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

  const handleGoBack = () => {
    history(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contrasena === "") {
      setContrasenaError("El campo de contraseña es obligatorio");
    } else if (contrasena !== repetirContrasena) {
      setContrasenaError("Las contraseñas no coinciden");
    } else {
      setContrasenaError("");
    }

    if (contrasena && repetirContrasena && !contrasenaError) {
      try {
        await axios.patch(`http://localhost:3001/usuarios/${idUsuario}`, {
          clave: contrasena,
        });

        history("/iniciar-sesion");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <div className="w-full h-screen bg-[#EDEDED] fixed top-0 grid place-items-center">
        <div className="w-full h-auto">
          <div className="w-full h-auto mx-auto text-center mt-4 mb-8">
            <h1>
              Recuperar
              <br />
              Contraseña
            </h1>
          </div>

          <Form className="w-full mx-auto mt-2">
            <Form.Group
              className="xl:w-[30%] 
              lg:w-[40%] lg:mt-[3%]
              md:w-[40%] mb-3 w-[70%] mx-auto"
              controlId="formGroupPassword"
            >
              <Form.Label
                className="xl:text-[35px] md:text-[30px] md:-ml-10"
              >
                Contraseña
              </Form.Label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={contrasena}
                className="min-[1920px]:w-[800px] min-[1920px]:text-[40px] xl:w-[600px] xl:h-[80px] xl:text-[30px] lg:h-[70px] lg:w-[500px] lg:text-[25px] md:mt-[10%] md:w-[450px] md:h-[70px] md:text-[25px] md:ml-[-50px] w-[280px] p-2 border border-slate-600 rounded-lg"
                onChange={(e) => {
                  setContrasena(e.target.value);
                  const error = validarPassword(e.target.value);
                  setContrasenaError(error ? passwordErrores[error] : "");
                }}
              />
              <button
                className="min-[2530px]:-ml-20 min-[2530px]:mt-24 min-[2240px]:mt-[-62px] min-[1920px]:-mt-16 min-[1860px]:-ml-20 min-[1860px]:mt-20 min-[1920px]:ml-[650px] xl:-mt-16 xl:ml-[500px] lg:-mt-14 lg:ml-[400px] lg:text-[40px] md:ml-[350px] md:text-[40px] md:-mt-14 absolute -mt-8 ml-[250px] text-xl"
                onClick={togglePasswordVisibility}
              >
                {passwordIcon}
              </button>
              {contrasenaError && (
                <p className="xl:text-[30px] md:text-[25px] md:ml-[-50px] text-red-500">{contrasenaError}</p>
              )}
            </Form.Group>
            <Form.Group
              className="xl:w-[30%] 
              lg:w-[40%] lg:mt-[3%]
              md:w-[40%] mb-3 w-[70%] mx-auto"
              controlId="formGroupRepitPassword"
            >
              <Form.Label className="xl:text-[35px] md:text-[30px] md:-ml-10 ml-[10%]">Repetir Contraseña</Form.Label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Repetir Contraseña"
                value={repetirContrasena}
                className="min-[1920px]:w-[800px] min-[1920px]:text-[40px] xl:w-[600px] xl:h-[80px] xl:text-[30px] lg:h-[70px] lg:w-[500px] lg:text-[25px] md:mt-[10%] md:w-[450px] md:h-[70px] md:text-[25px] md:ml-[-50px] w-[280px] p-2 border border-slate-600 rounded-lg"
                onChange={(e) => {
                  setRepetirContrasena(e.target.value);
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
              {contrasenaError && (
                <p className="xl:text-[30px] md:text-[25px] md:ml-[-50px] text-red-500">{contrasenaError}</p>
              )}
            </Form.Group>

            <div className="lg:mt-[5%] w-[95%] h-auto mx-auto mt-12">
              <div className="grid grid-cols-1 place-items-center">
                <Button
                  type="submit"
                  className="xl:w-[400px] lg:w-[300px] md:w-[300px] mb-[1rem] w-48 bg-[#00057B]"
                  onClick={handleSubmit}
                >
                  <span className="xl:text-[40px] lg:text-[30px] md:text-[30px]">Cambiar clave</span>
                </Button>
              </div>
            </div>
          </Form>

          <div
            className="xl:mt-[6%] md:mt-[8%]
        lg:mt-[13%] w-full flex justify-content-between align-items-center mt-32"
          >
            <IoIosArrowBack
              className="lg:text-[60px] md:text-[60px] mt-1 ml-4 mb-2 text-3xl"
              onClick={handleGoBack}
            />
            <Link to="/">
              <FiHome className="lg:text-[60px] md:text-[60px] text-black text-2xl mr-5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
