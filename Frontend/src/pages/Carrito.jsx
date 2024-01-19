import React, { useState } from "react";

// Otros
import * as comp from "../components/routesComp";
import { useAuth } from "../components/AuthContext";
import axios from "axios";

//Iconos
import { GrStatusGood } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";

// Imagenes
import Logo from "../assets/img/logo_2.png";

// React Router Dom
import { Link } from "react-router-dom";

export const Carrito = () => {
  const { cart, updateCart } = useAuth();
  const [selectAll, setSelectAll] = useState(false);

  const handleIncrement = async (productId) => {
    const product = cart.find((p) => p._id === productId);
    if (!product) {
      return;
    }

    const cantidad = product.cantidad + 1;

    try {
      const response = await axios.patch(
        `http://localhost:3001/productos/cantidad/${productId}`,
        {
          cantidad: cantidad,
        }
      );

      if (response.status === 200) {
        const updatedCart = cart.map((p) => {
          if (p._id === productId) {
            return { ...p, cantidad: cantidad };
          }
          return p;
        });

        updateCart(updatedCart);
      } else {
        console.error("Error al actualizar la cantidad del producto");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud a la API:", error);
    }
  };

  const handleDecrement = async (productId) => {
    const product = cart.find((p) => p._id === productId);
    if (!product || product.cantidad === 0) {
      return;
    }

    const cantidad = product.cantidad - 1;

    try {
      const response = await axios.patch(
        `http://localhost:3001/productos/cantidad/${productId}`,
        {
          cantidad: cantidad,
        }
      );

      if (response.status === 200) {
        const updatedCart = cart.map((p) => {
          if (p._id === productId) {
            return { ...p, cantidad: cantidad };
          }
          return p;
        });

        updateCart(updatedCart);
      } else {
        console.error("Error al actualizar la cantidad del producto");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud a la API:", error);
    }
  };

  const handleDelete = (productId) => {
    const updatedCart = cart.filter((product) => product._id !== productId);
    updateCart(updatedCart);
  };

  const handleDeleteAllSelected = () => {
    const updatedCart = cart.filter((product) => !product.selected);
    updateCart(updatedCart);
  };

  const handleSelectAll = () => {
    const allSelected = cart.every((product) => product.selected);
    const updatedCart = cart.map((product) => ({
      ...product,
      selected: !allSelected,
    }));
    updateCart(updatedCart);
    setSelectAll(!allSelected);
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

      <div className="lg:h-52 grid grid-rows mb-2 w-[96%] h-32 mx-auto mt-4 bg-white drop-shadow-xl rounded-2xl px-3 py-2">
        <div className="lg:mt-16 lg:h-20 md:w-[60%] text-sm">
          <p className="lg:text-[25px] text-black text-base">
            Cesta de compra (
            {cart.reduce((total, product) => total + product.cantidad, 0)})
          </p>
          <button
            className="lg:text-[25px] lg:mt-6 flex flex-row cursor-pointer"
            onClick={handleSelectAll}
          >
            {selectAll ? (
              <GrStatusGood className="mr-2 text-green-500 mt-[1px]" />
            ) : (
              <RiCheckboxBlankCircleLine className="mr-2 text-red-500 mt-[1px]" />
            )}
            Seleccionar todos los productos
          </button>
        </div>
        <span className="min-[1920px]:mt-[-7%] lg:h-[8em] lg:mt-[-10%] bg-slate-400 h-[5em] w-[1px] mt-[-3em] ml-[62%]"></span>
        <button
          className="min-[1920px]:mt-[-6%] xl:mt-[-9.5%] lg:w-[25%] lg:text-[25px] lg:mt-[-13%] md:w-[20%] md:ml-[70%] w-32 h-8 flex flex-row-reverse space-x-4 space-x-reverse text-[13px] ml-[200px] mt-[-70px] text-[#1355FF] active:text-green-600"
          onClick={handleDeleteAllSelected}
        >
          Borra todos los productos
        </button>
      </div>

      {cart.map((product) => (
        <>
          <div
            key={product._id}
            className="lg:h-[300px] grid grid-rows mb-2 w-[96%] h-40 mx-auto mt-4 bg-white drop-shadow-xl rounded-2xl px-3"
          >
            <div className="text-sm">
              <p className="lg:text-[25px] lg:mt-12 flex flex-row text-black text-xs">
                {product.selected ? (
                  <GrStatusGood className="mr-2 text-green-500 mt-[1px]" />
                ) : (
                  <RiCheckboxBlankCircleLine className="mr-2 text-red-500 mt-[1px]" />
                )}
                {product.nombre} ({product.cantidad})
              </p>
              <p className="min-[1920px]:ml-[-72%] lg:text-[25px] lg:ml-[-50%] md:ml-[-60%] grid justify-items-center mt-[-5px] text-slate-600 text-sm">
                Harina de Maíz Blanco refinada, precocida...
              </p>

              <div className="lg:mt-16 mt-6 flex flex-row">
                <img
                  src={`http://localhost:3001/Productos/${product.imagen}`}
                  alt="alimentos polar"
                  className="lg:w-28 lg:h-28 w-16 h-16"
                />
                <div className="flex flex-col">
                  <p className="lg:text-[25px] text-black">
                    USD {product.precio}
                    <br />
                    <span className="lg:text-[20px] text-slate-600 text-xs">
                      Envío: BsS 40
                    </span>
                  </p>
                </div>
              </div>
              <div className="min-[2230px]:mt-[-7%] min-[1920px]:mt-[-9%] xl:mt-[-12%] lg:mt-[-15%] md:mt-[-8%] h-4 w-4 ml-[80%] mt-[-18%]">
                <MdDeleteOutline
                  className="lg:text-[40px] ml-12 text-2xl"
                  onClick={() => handleDelete(product._id)}
                />
                <div className="lg:text-[30px] lg:mt-4 flex flex-row gap-4">
                  <button onClick={() => handleDecrement(product._id)}>
                    -
                  </button>
                  <p className=" my-2 ">{product.cantidad}</p>
                  <button onClick={() => handleIncrement(product._id)}>
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ))}

      <div className="grid grid-rows mb-2 w-[96%] h-60 mx-auto mt-4 bg-white drop-shadow-xl rounded-2xl px-3 py-2">
        <div className="lg:text-[25px] text-sm mt-4">
          <p className="lg:text-[30px] lg:mb-12 text-black text-base flex flex-row">Resumen:</p>
          <p>
            Total parcial:
            <span className="ml-10">
              US $
              {cart.reduce(
                (total, product) => total + product.cantidad * product.precio,
                0
              )}{" "}
              || BsS{" "}
              {cart.reduce(
                (total, product) => total + product.cantidad * product.precio,
                0
              ) * 40}
            </span>
          </p>
          <p>
            Total de envío:
            <span className="ml-8">US $1.00 || BsS 40</span>
          </p>
          <p>
            Total de pago:
            <span className="lg:text-[25px] ml-9 text-black text-base">
              US $
              {cart.reduce(
                (total, product) => total + product.cantidad * product.precio,
                0
              ) + 1}{" "}
              || BsS{" "}
              {(cart.reduce(
                (total, product) => total + product.cantidad * product.precio,
                0
              ) +
                1) *
                40}
            </span>
          </p>
          <Link
            to={`/facturacion/${cart.map((product) => product._id).join("-")}`}
          >
            <button className="min-[1920px]:mt-[-7%] lg:w-40 lg:h-20 lg:text-[25px] lg:mt-[-12%] lg:mr-[15%] md:float-right md:mr-[20%] md:mt-[-10%] md:w-32 md:h-14 md:text-[20px] ml-[35%] bg-red-500 w-24 h-10 rounded-2xl text-white">
              PAGAR (
              {cart.reduce((total, product) => total + product.cantidad, 0)})
            </button>
          </Link>
        </div>
      </div>

      <br />

      <comp.Footer />
      <comp.SubMenu />
    </>
  );
};
