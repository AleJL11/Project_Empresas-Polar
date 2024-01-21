import React, { useState, useEffect } from "react";

// imagenes
import Logo from "../assets/img/logo_2.png";
import ToboCervezas from "../assets/img/tobo_cervezas.jpg";
import HarinaPan from "../assets/img/trio_harina_pan.jpg";
import PepsiCola from "../assets/img/pepsi_cola.jpg";
import Banner from "../assets/img/banner_home.jpg";

// Iconos
import { MdComputer } from "react-icons/md";
import { LiaBoxSolid } from "react-icons/lia";

// React Router Dom
import { Link } from "react-router-dom";

//Otros
import axios from "axios";
import { slice } from "lodash";
import * as comp from "../components/routesComp";

export const Home = () => {
  const [alimentosPolar, setAlimentosPolar] = useState([]);

  useEffect(() => {
    const getAlimentosPolar = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/alimentos-polar"
        );
        //console.log(response.data);
        setAlimentosPolar(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAlimentosPolar();
  }, []);

  return (
    <>
      <comp.Header />

      <div
        className="
      xl:w-[70%]
      lg:h-[50%]
      md:w-[70%] md:h-[70%] md:mt-[-8]
      w-[90%] h-72 mx-auto mt-[-50px]
      "
      >
        <div
          className="
          min-[1920px]:w-[40%] min-[1920px]:h-[250px]
        xl:w-[50%]
        lg:w-[60%] lg:h-[200px]
        md:h-[200px] md:w-[60%]
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
        <div
          className="
        xl:mt-7
        lg:mt-[-1%] lg:mb-20
        md:mt-8 md:mb-20
        w-full h-40"
        >
          <comp.Carousel />
        </div>
      </div>

      <p className="xl:text-[40px] lg:text-[35px] md:text-[35px] text-lg text-[#F90A0A] ml-4 mt-4">
        Productos:
      </p>

      <div className="lg:flex lg:flex-row lg:justify-center lg:items-center md:mt-10">
        {/* Cerveceria Polar */}
        <section
          className="
        min-[1920px]:h-60
        lg:w-[50%] lg:h-50
        md:h-60 md:flex md:justify-center
        w-[90%] h-40 mx-auto flex flex-row drop-shadow-xl"
        >
          <div className="md:w-[60%] w-[50%] h-full text-base flex justify-center items-center text-center text-white bg-[#00057B]">
            <p
              className="
              xl:text-[30px]
              lg:text-[25px]
              md:text-[25px]
              text-center px-4"
            >
              Una porlacita destapa lo mejor de nosotros
            </p>
          </div>

          <div
            className="
            min-[1920px]:w-[20%]
            lg:w-[47%]
            md:w-[30%]
            w-[50%] h-full"
          >
            <img
              src={ToboCervezas}
              alt="Tobo de cervezas polar"
              className="lg:w-52 w-full h-full"
            />
          </div>
        </section>

        {/* Alimentos Polar */}
        <section
          className="
          min-[1920px]:h-60
          lg:w-[50%] lg:h-52
          md:h-60 md:flex md:justify-center md:mx-auto
          w-[90%] h-40 mx-auto flex flex-row my-7 drop-shadow-xl"
        >
          <div
            className="
            min-[1920px]:w-[30%]
            lg:w-[47%] md:w-[40%]
            w-[50%] h-full bg-white"
          >
            <img
              src={HarinaPan}
              alt="Harina P.A.N"
              className="md:h-32 w-full h-24 mt-4"
            />
          </div>

          <div className="w-[50%] h-full text-base flex justify-center items-center text-center text-white bg-[#E81D1D]">
            <p className="xl:text-[30px] lg:text-[25px] md:text-[25px] text-center px-4">
              Llena tu vida de sabor con P.A.N!
            </p>
          </div>
        </section>
      </div>
      {/* Pepsi-Cola Venezuela */}
      <section
        className="
        min-[1920px]:h-60
        lg:w-[50%]
        md:h-60 md:flex md:justify-center md:mx-auto
        w-[90%] h-40 mx-auto flex flex-row drop-shadow-xl"
      >
        <div className="md:w-[60%] w-[50%] h-full text-base flex justify-center items-center text-center text-white bg-[#00057B]">
          <p className="xl:text-[30px] lg:text-[25px] md:text-[25px] text-center px-4">
            Nada sabe mejor que una pepsi...
          </p>
        </div>

        <div className="min-[1920px]:w-[30%] lg:w-[47%] md:w-[40%] w-[50%] h-full bg-white">
          <img
            src={PepsiCola}
            alt="Pepsi-Cola Venezuela"
            className="md:h-32 w-full h-24 mt-4"
          />
        </div>
      </section>

      {/* Banner */}
      <section
        className="
        xl:h-80
      md:flex md:justify-center md:h-72
      w-full h-64 bg-[#00057B] flex flex-row my-7"
      >
        <div className="xl:w-[70%] md:ml-[4px] w-[50%] h-full flex flex-col justify-center items-center">
          <div>
            <p className="xl:text-[35px] lg:text-[30px] md:text-[30px] text-base text-white text-center">
              50% de descuento en esta gran época del año
            </p>
          </div>
          <div>
            <p className="xl:mt-4 xl:text-[25px] lg:text-[20px] md:text-[20px] text-xs text-white text-center px-2">
              Empresas polar en este año te proporciona un descuento de 50% en
              todos nuestro productos
            </p>
          </div>
          <div className="xl:text-[30px] lg:text-[25px] md:text-[25px] mt-2 cursor-pointer text-xs">
            <Link className="text-white no-underline" to="/catalogo">
              Ver aquí los productos
            </Link>
          </div>
        </div>

        <div
          className="
          xl:mt-10
        lg:ml-[20%] lg:mt-4
        md:mt-8
        w-[40%] h-full my-[15%] ml-7"
        >
          <img src={Banner} alt="Imagen Banner" className="rounded-md" />
        </div>
      </section>

      {/* Vista de categorias */}
      <section
        className="
      xl:h-[500px]
      lg:flex lg:flex-row lg:items-center lg:justify-center lg:w-[95%] lg:h-[350px] lg:py-2
      md:h-[900px]
      w-[90%] h-3/5 mx-auto flex flex-col drop-shadow-lg"
      >
        <div
          className="
          min-[1920px]:h-[90%]
          xl:w-[50%] xl:h-[100%]
          lg:flex lg:justify-center lg:flex-col lg:w-[40%] lg:h-[90%]
          md:h-[55%]
          w-[95%] h-full bg-white mx-auto"
        >
          <div className="xl:text-[25px] lg:text-[25px] md:text-[25px] w-full h-auto">
            <p className="xl:ml-3">
              Categorías: <em>{alimentosPolar.titulo}</em>
            </p>
          </div>
          <div className="md:h-36 w-[50%] h-auto mb-2 mx-auto">
            {slice(alimentosPolar.productos, 5, 6) &&
              slice(alimentosPolar.productos, 5, 6).map((alimento) => (
                <img
                  key={alimento._id}
                  src={`http://localhost:3001/Productos/${alimento.imagen}`}
                  alt={alimento.nombre}
                  className="min-[1920px]:h-[300px] w-[90%] h-full mx-auto"
                />
              ))}
          </div>
          <button
            className="
            xl:mx-auto xl:h-16 xl:text-[25px]
          lg:ml-20 lg:w-[60%]
          md:ml-[30%] md:text-[30px] md:h-12
          w-[40%] h-8 ml-24 mb-4 bg-[#D9D9D9] tracking-wide"
          >
            <Link to="/catalogo" className="no-underline text-black">
              ALIMENTOS
            </Link>
          </button>
        </div>
        <div
          className="
          xl:w-[50%] xl:h-[85%]
          lg:grid lg:grid-cols-2 lg:grid-rows-2 lg:place-items-center lg:h-[85%] lg:mx-auto
          md:ml-[13%] md:h-96
          min-[420px]:ml-[5%]
          w-[50%] h-full grid grid-cols-2 gap-4 mt-4"
        >
          {slice(alimentosPolar.productos, 0, 4) &&
            slice(alimentosPolar.productos, 0, 4).map((alimento) => (
              <div
                key={alimento._id}
                className="
                min-[1920px]:w-[45%]
                xl:h-[180px]
                lg:w-[65%] lg:h-32 lg:mx-auto
                md:h-40
                w-full h-24 bg-white ml-20"
              >
                <img
                  src={`http://localhost:3001/Productos/${alimento.imagen}`}
                  alt={alimento.nombre}
                  className="w-full h-full"
                />
              </div>
            ))}
        </div>
      </section>

      {/* Información */}
      <section
        className="
      xl:h-64
      lg:flex lg:flex-row lg:items-center lg:w-[95%] lg:h-52
      md:h-[420px]
      w-[90%] h-[90%] my-2 mx-auto drop-shadow-xl"
      >
          <div className="xl:h-full xl:-mt-0 w-[95%] h-36 mx-auto gap-4 mt-6">
            <div className="lg:mt-0 w-full h-auto mt-12 text-6xl text-center flex flex-col items-center">
              <MdComputer />
              <p className="xl:text-[25px] xl:mt-4 lg:text-[25px] md:text-[25px] text-base">
                Compra desde la comodidad de tu hogar
              </p>
              <p className="min-[1920px]:text-[25px] xl:text-[20px] lg:text-[25px] md:text-[23px] text-xs mt-2">
                Encuentra lo que necesitas. Es fácil y rápido! ¡Todos podemos
                hacerlo!
              </p>
            </div>
          </div>

          <div className="xl:h-[80%] lg:w-[1px] lg:h-[60%] lg:mt-[60%] w-[50%] h-[1px] mx-auto bg-[#A7A7A7] mt-4"></div>

          <div className="xl:h-full xl:-mt-0 w-[95%] h-36 mx-auto gap-4 mt-6">
            <div className="lg:mt-0 w-full h-auto mt-12 text-6xl text-center flex flex-col items-center">
              <LiaBoxSolid />
              <p className="xl:text-[25px] xl:mt-4 lg:text-[25px] md:text-[25px] text-base">
                Recibe tu producto
              </p>
              <p className="min-[1920px]:text-[25px] xl:text-[20px] lg:text-[25px] md:text-[23px] text-xs mt-2">
                Puedes recibirlo en tu casa o retirarlo. ¡Tu decides que
                prefieres!
              </p>
            </div>
          </div>
      </section>

      <comp.Footer />

      <comp.SubMenu />
    </>
  );
};
