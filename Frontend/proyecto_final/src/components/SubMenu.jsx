import React from "react";

// Iconos
import { FaShoppingBag, FaUser, FaArrowLeft } from "react-icons/fa";
import { FiHome } from "react-icons/fi";

// React Router Dom
import { Link, useNavigate } from "react-router-dom";

export const SubMenu = () => {
  const history = useNavigate();

  const handleGoBack = () => {
    history(-1);
  };

  return (
    <>
      <section className="lg:hidden w-full h-auto bottom-0 bg-white flex flex-row drop-shadow-xl">
        <div className="w-[25%] h-20 mt-2 flex flex-col justify-center items-center">
          <Link className="grid place-items-center text-black no-underline" onClick={handleGoBack}>
            <FaArrowLeft className="mt-2" />
            <p className="mt-2">Volver</p>
          </Link>
        </div>
        <div className="w-[25%] h-20 mt-2 flex flex-col justify-center items-center">
          <Link className="grid place-items-center text-black no-underline" to="/catalogo">
            <FaShoppingBag className="mt-2" />
            <p className="mt-2">Productos</p>
          </Link>
        </div>
        <div className="w-[25%] h-20 mt-2 flex flex-col justify-center items-center">
          <Link className="grid place-items-center text-black no-underline" to="/perfil-usuario">
            <FaUser className="mt-2" />
            <p className="mt-2">Perfil</p>
          </Link>
        </div>
        <div className="w-[25%] h-20 mt-2 flex flex-col justify-center items-center">
          <Link className="grid place-items-center text-black no-underline" to="/">
            <FiHome className="mt-2" />
            <p className="mt-2">Inicio</p>
          </Link>
        </div>
      </section>
    </>
  );
};
