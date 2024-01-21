import React from "react";
import { FaInstagram } from "react-icons/fa6";
import { CiTwitter } from "react-icons/ci";
import { LuFacebook } from "react-icons/lu";

export const Footer = () => {
  return (
    <>
      <div className="lg:flex lg:flex-row lg:h-[11em] w-full h-64 bg-[#D9D9D9] flex flex-col">
        <div className="
        lg:text-[20px] lg:w-[50%] lg:mx-auto lg:flex lg:items-center lg:mt-24
        md:text-[25px]
        w-[85%] h-36 mx-auto mt-4 text-sm">
          <p>
            © Empresas Polar 2015. Todos los derechos reservados.
            <br />
            <br />
            Rif: J-00006372-9
            <br />
            <br />
            Términos y Condiciones | Política de Datos | Aspectos Legales
          </p>
        </div>
        <div className="lg:hidden md:w-[70%] w-[50%] h-[1px] mx-auto bg-[#A7A7A7]"></div>
        <div className="lg:w-[40%] lg:flex lg:items-center
       md:w-[50%] md:flex md:items-center
       w-[85%] h-36 mx-auto mt-4 flex flex-row">
          <div className="w-[33.33%] h-20 flex justify-center items-center">
            <FaInstagram className="min-[2230px]:w-[20%] min-[1920px]:w-[25%] w-[35%] h-auto"/>
          </div>
          <div className="w-[33.33%] h-20 flex justify-center items-center">
            <CiTwitter className="min-[2230px]:w-[20%] min-[1920px]:w-[25%] w-[35%] h-auto"/>
          </div>
          <div className="w-[33.33%] h-20 flex justify-center items-center">
            <LuFacebook className="min-[2230px]:w-[20%] min-[1920px]:w-[25%] w-[35%] h-auto"/>
          </div>
        </div>
      </div>
    </>
  );
};
