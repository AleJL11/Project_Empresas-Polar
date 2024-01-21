import React from "react";

//React Router Dom
import { Link, useNavigate } from "react-router-dom";

//Iconos
import { FaUserTie } from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FiHome } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";

export const NavbarDash = () => {
  const history = useNavigate();

  const handleGoBack = () => {
    history(-1);
  };

  return (
    <>
      <section className="lg:hidden w-full h-auto bg-[#D9D9D9] flex flex-row drop-shadow-xl">
        <div className="md:text-[25px] w-[25%] h-20 flex flex-col justify-center items-center">
          <Link className="text-center mt-3">
            <IoIosArrowBack className="text-black" onClick={handleGoBack} />
          </Link>
          <p className="text-center mt-1">Volver</p>
        </div>
        <div className="md:text-[25px] w-[25%] h-20 flex flex-col justify-center items-center">
          <Link className="text-center mt-3" to="/">
            <FiHome className="text-black" />
          </Link>
          <p className="text-center mt-1">Inicio</p>
        </div>
        <div className="md:text-[25px] w-[25%] h-20 flex flex-col justify-center items-center">
          <Link className="text-center mt-3" to="/reporte-cliente">
            <HiOutlineDocumentReport className="text-black" />
          </Link>
          <p className="text-center mt-1">Reportes</p>
        </div>
        <div className="md:text-[25px] w-[25%] h-20 flex flex-col justify-center items-center">
          <Link className="text-center mt-3" to="/info-vendedores">
            <FaUserTie className="text-black" />
          </Link>
          <p className="text-center mt-1">Vendedores</p>
        </div>
      </section>
    </>
  );
};
