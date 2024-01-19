import React, { useState, useEffect } from "react";

// Otros
import * as comp from "../components/routesComp";
import axios from "axios";

// React Router Dom
import { Link } from "react-router-dom";

// Logos
import Cerveceria_Polar from "../assets/img/Logos/Cerveceria_Polar.png";
import Alimentos_Polar from "../assets/img/Logos/Alimentos_Polar.png";
import PepsiCola_Venezuela from "../assets/img/Logos/PepsiCola_Venezuela.png";

// Iconos
import { FiShoppingCart } from "react-icons/fi";

export const Products = () => {
  const [categoria, setCategoria] = useState("alimentos-polar");
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchProductos(categoria);
  }, [categoria]);

  const fetchProductos = async (categoria) => {
    try {
      const response = await axios.get(`http://localhost:3001/${categoria}`);
      setCategoria(categoria);
      setProductos(response.data.productos);
    } catch (error) {
      console.error("Hubo un error al obtener los productos:", error);
    }
  };

  return (
    <>
      <comp.Header />
      <div
        className="min-[1920px]:h-[270px] lg:w-[50%] lg:h-[200px] md:w-[70%] md:h-[70%] md:mt-[-8]
      grid grid-rows grid-flow-col place-content-center w-[90%] h-32 mx-auto mt-[-50px] bg-white drop-shadow-xl rounded-t-lg"
      >
        <div
          onClick={() => fetchProductos("alimentos-polar")}
          className="min-[1920px]:w-[200px] lg:w-[150px] grid grid-rows grid-flow-col-1 place-items-center w-28 h-28"
        >
          <img
            src={Alimentos_Polar}
            alt="alimentos polar"
            className="w-full h-full mx-auto"
          />
        </div>
        <div
          onClick={() => fetchProductos("pepsicola-venezuela")}
          className="min-[1920px]:w-[200px] lg:w-[150px] grid grid-rows grid-flow-col place-items-center w-28 h-28"
        >
          <img
            src={PepsiCola_Venezuela}
            alt="Pepsi cola"
            className="w-full h-[80%] mx-auto"
          />
        </div>
        <div
          onClick={() => fetchProductos("cerveceria-polar")}
          className="min-[1920px]:w-[200px] min-[1920px]:-mt-8 lg:w-[150px] lg:-mt-4 grid grid-rows grid-flow-col place-items-center w-28 h-28"
        >
          <img
            src={Cerveceria_Polar}
            alt="Cervecería Polar"
            className="w-full h-full mx-auto"
          />
        </div>
      </div>

      <div className="lg:text-[35px] mt-4 px-2">
        <p>
          Categoria: <em>{categoria.replace("-", " ")}</em>
        </p>
      </div>

      {/* Segunda parte */}
      <div
        className="lg:w-[88%] lg:h-[80%] lg:grid lg:place-items-center
        md:w-[90%] md:h-96 md:grid md:place-items-center
        grid grid-cols-3 place-content-center gap-2 mx-auto w-[95%] h-96 drop-shadow-xl rounded-t-lg bg-white"
      >
        {productos.map((producto) => (
          <div
            key={producto._id}
            className="lg:h-[500px] md:mt-[-5%] md:h-[98%] grid place-content-center w-[90%] h-26 shadow-md"
          >
            <div className="lg:h-[200px] w-[100%] h-[100px]">
              <Link to={`/catalogo/${producto._id}`}>
                <img
                  src={`http://localhost:3001/Productos/${producto.imagen}`}
                  alt={producto.nombre}
                  className="w-full h-full"
                />
              </Link>
            </div>
            <p className="lg:text-[25px] md:text-base text-sm text-center mt-2">
              {producto.nombre}
            </p>
            <p className="lg:text-[25px] lg:mt-4 text-left text-xs mt-[-10px] px-2">
              USD {producto.precio}
            </p>
            <div
              className="lg:h-[70px] lg:w-[70px]
                 md:my-1 grid place-items-center ml-[70%] mt-[-30%] mb-1 mr-4 bg-blue-200 h-8 w-8 rounded-full"
            >
              <Link>
                <FiShoppingCart className="lg:text-[30px] text-center text-black" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <br />
      <comp.Footer />
      <comp.SubMenu />
    </>
  );
};
