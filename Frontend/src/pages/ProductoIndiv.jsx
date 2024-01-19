import React from "react";

// Otros
import * as comp from "../components/routesComp";
import { useAuth } from "../components/AuthContext";
import axios from "axios";

// Iconos
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa6";

// Imagenes
import Logo from "../assets/img/logo_2.png";

// React Router Dom
import { useParams } from "react-router-dom";

export const ProductoIndiv = () => {
  const { id } = useParams();
  const url = `http://localhost:3001/productos/${id}`;
  const { response, error } = comp.ApiHook("get", url);

  const { addToCart } = useAuth();

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!response) {
    return (
      <div className="loader">
        <div className="loader-text">Cargando...</div>
        <div className="loader-bar"></div>
      </div>
    );
  }

  const handleAddToCart = async (product) => {
    try {
      const newQuantity = product.cantidad + 1;
      const response = await axios.patch(
        `http://localhost:3001/productos/cantidad/${product._id}`,
        { cantidad: newQuantity }
      );
      console.log("Cantidad actualizada:", response.data);
      addToCart({ ...product, cantidad: newQuantity });
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error);
    }
  };

  return (
    <>
      <comp.Header />
      <div
        className="
      xl:w-[70%]
      lg:h-[50%]
      md:w-[70%] md:h-[70%] md:mt-[-8]
      w-[90%] h-20 mx-auto mt-[-50px]
      "
      >
        <div
          className="
          min-[1920px]:w-[40%] min-[1920px]:h-[250px]
        xl:w-[50%]
        lg:w-[60%] lg:h-[200px]
        md:h-[50%]
        w-[50%] h-20 mx-auto bg-white rounded-t-lg drop-shadow-xl
        "
        >
          <img
            src={Logo}
            alt="Logo Empresas Polar"
            className="
            md:w-[95%] md:h-full md:p-2
            w-[95%] h-full mx-auto p-2"
          />
        </div>
      </div>
      <br />

      <div className="min-[2230px]:w-[20%] min-[1920px]:w-[30%] lg:w-[45%] lg:h-[400px] lg:flex lg:flex-col lg:justify-center lg:items-center mx-auto w-72">
        <img
          src={`http://localhost:3001/Productos/${response.product.imagen}`}
          alt="alimentos polar"
          className="h-[100%] w-[100%] mx-auto"
        />
      </div>

      <div className="flex flex-row gap-4 px-4 mt-6">
        <p className="lg:text-[30px]">
          <span className="text-red-500">BsS </span>
          {response.product.precio * 40}
        </p>
        <p className="lg:text-[30px]">
          <span className="text-red-500">USD </span>
          {response.product.precio}
        </p>
      </div>

      <p className="lg:text-[30px] text-sm px-4">
        {response.product.descripcion}
      </p>

      <div className="lg:text-[30px] w-full flex flex-row gap-2 text-xl text-yellow-400 ml-6 mb-2">
        <FaStar />
        <FaStar />
        <FaStar />
        <FaRegStar />
        <FaRegStar />
        <p className="lg:text-[20px] text-black text-sm text-center">3.8</p>
        <span className="flex flex-row bg-slate-600 h-8 w-[1px] mt-[-6px]"></span>
        <p className="lg:text-[30px] text-base text-center text-slate-800">
          20.000.000 Vendidos
        </p>
      </div>

      <div className="lg:h-[300px] flex flex-col bg-slate-300 w-full h-[8em] text-sm">
        <p className="min-[1920px]:py-[3%] min-[1920px]:ml-12 lg:w-[60%] lg:h-36 lg:py-[5%] lg:text-[30px] min-[320px]:text-sm mt-3 ml-2">
          Entrega
          <br />
          <br />
          Envió: BsS 40
          <br />
          <br />
          <span className="text-slate-500 h-12">
            Fecha estimada de entrega: 1 a 2 días
          </span>
          <br />
          <br />
          Cantidad: 1
        </p>
        <span className="min-[2230px]:mt-[-7%] min-[1920px]:mt-[-7.5%] xl:mt-[-11%] lg:mt-[-15%] lg:h-[80%] bg-slate-600 h-[6em] w-[2px] mt-[-7em] ml-[60%]"></span>

        <button
          className="min-[1920px]:mt-[-7%] min-[1920px]:w-[20%] min-[1920px]:ml-[70%] xl:mt-[-11%] lg:h-12 lg:text-[25px] lg:mt-[-15%] md:mt-[-8%] ml-[65%] mt-[-15%] bg-red-500 text-white h-10 w-[30%] rounded-lg"
          onClick={() => handleAddToCart(response.product)}
        >
          Añadir al carrito
        </button>
      </div>

      <comp.Footer />
      <comp.SubMenu />
    </>
  );
};
