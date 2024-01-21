import React, { useState, useEffect } from "react";

// Otros
import { useAuth } from "./AuthContext";
import axios from "axios";

// Iconos
import { CiMenuBurger } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";

// Imagenes
import PerfilImg from "../assets/img/perfil/perfil.png";

// React Router Dom
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const url = "http://localhost:3001/productos";
  const history = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    userRole,
    searchProduct,
    setRole,
    setSearch,
    imgUser,
    userName,
    cart,
  } = useAuth();

  useEffect(() => {
    setCartItemCount(
      cart.reduce((total, product) => total + product.cantidad, 0)
    );
  }, [cart]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setRole(null);
    history("/iniciar-sesion");
  };

  const handleGoBack = () => {
    history(-1);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(url, {
        params: {
          //page,
          limit: itemsPerPage,
          deleted: false,
          search: searchTerm,
        },
      });
      setSearch(response.data.data);
      history("/catalogo", { searchProduct });
    } catch (error) {
      console.log("Error al obtener los datos:", error);
    }
  };

  return (
    <>
      <div className="xl:h-48 md:h-48 w-full h-40 rounded-[0_0_50px_50px] bg-[#E81D1D]">
        <div className="w-full h-14 grid grid-cols-3 place-items-center">
          <div className="lg:flex lg:flex-row lg:text-xl lg:gap-10 mr-4">
            <FaArrowLeft
              className="xl:text-[40px] lg:text-[25px] lg:block min-[320px]:hidden lg:text-white"
              onClick={handleGoBack}
            />
            <Link to="/perfil-usuario">
              <FaUser className="xl:text-[40px] lg:text-[25px] lg:block min-[320px]:hidden lg:text-white" />
            </Link>
            <CiMenuBurger
              className="lg:hidden md:text-[35px] text-2xl text-white"
              onClick={toggleMenu}
            />
          </div>
          <div className="flex items-center justify-center">
            <div className="rounded-lg bg-gray-200">
              <div className="lg:flex lg:justify-center lg:items-center lg:w-96 flex">
                <div className="xl:h-[35px] flex w-10 items-center justify-center rounded-l-lg border-r border-gray-200 bg-white">
                  <IoSearch className="md:text-[20px]" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="xl:h-[35px] lg:w-[100%] lg:h-8
                  md:w-96 md:text-[25px] md:h-10 w-full bg-white pl-2 text-base font-semibold outline-0 rounded-r-lg"
                  placeholder="Buscar"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <div className="w-[33.33%] h-full ml-7">
            <div className="lg:flex lg:flex-row lg:gap-8 grid place-items-center mt-2">
              {userRole ? (
                <>
                  <img
                    src={`http://localhost:3001/Usuarios/${imgUser}`}
                    alt="Imagen de perfil"
                    className="xl:w-16 xl:h-16 md:w-16 md:h-16 w-10 h-10 rounded-full object-fill"
                    title={userName}
                  />
                  <div className="xl:text-[40px] lg:text-[35px]">
                    <IoIosLogOut
                      className="lg:block lg:text-white min-[320px]:hidden"
                      onClick={handleLogout}
                    />
                  </div>
                </>
              ) : (
                <img
                  src={PerfilImg}
                  alt="Imagen de perfil por defecto"
                  className="xl:w-16 xl:h-16 md:w-16 md:h-16 w-10 h-10 rounded-full object-fill"
                  title="Perfil por defecto"
                />
              )}
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:w-[200px] md:mt-4 md:ml-10 ml-5 bg-[#00057B] w-40 h-auto absolute rounded-md z-10">
            <div className="md:text-[30px] p-2 text-center">
              {userRole === "administrador" && (
                <>
                  <li className="list-none mb-3">
                    <Link className="text-white no-underline" to="/usuarios">
                      Panel de Control
                    </Link>{" "}
                  </li>
                  <li className="list-none">
                    <button
                      className="text-white no-underline"
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </>
              )}
              {userRole === "vendedor" && (
                <>
                  <li className="list-none mb-3">
                    <Link className="text-white no-underline" to="/usuarios">
                      Panel de Control
                    </Link>{" "}
                  </li>
                  <li className="list-none">
                    <button
                      className="text-white no-underline"
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </>
              )}
              {userRole === "cliente" && (
                <li className="list-none">
                  <button
                    className="text-white no-underline"
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </button>
                </li>
              )}
              {userRole === null && (
                <>
                  <li className="list-none mb-3">
                    <Link
                      className="text-white no-underline"
                      to="/iniciar-sesion"
                    >
                      Iniciar Sesión
                    </Link>{" "}
                  </li>
                  <li className="list-none">
                    <Link className="text-white no-underline" to="/registrarse">
                      Registrarse
                    </Link>
                  </li>
                </>
              )}
            </div>
          </div>
        )}

        <div className="xl:mt-6 lg:text-[25px] md:mt-6 md:text-[25px] w-full flex flex-row gap-4 justify-center">
          {userRole === "administrador" && (
            <>
              <li className="xl:text-[25px] list-none text-white tracking-wide">
                <Link className="text-white no-underline" to="/catalogo">
                  Productos
                </Link>
              </li>
              <li className="xl:text-[25px] list-none text-white tracking-wide">
                <Link className="text-white no-underline" to="/carro-de-compra">
                  Carrito
                  {cartItemCount > 0 && (
                    <div className="xl:ml-[70px] xl:-mt-10 lg:ml-[55px] absolute -mt-8 ml-10 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                      {cartItemCount}
                    </div>
                  )}
                </Link>
              </li>
              <li
                className="min-[320px]:hidden lg:block
          xl:text-[25px] list-none text-white tracking-wide"
              >
                <Link className="text-white no-underline" to="/usuarios">
                  Panel de Control
                </Link>{" "}
              </li>
            </>
          )}
          {userRole === "vendedor" && (
            <>
              <li className="xl:text-[25px] list-none text-white tracking-wide">
                <Link className="text-white no-underline" to="/catalogo">
                  Productos
                </Link>
              </li>
              <li className="xl:text-[25px] list-none text-white tracking-wide">
                <Link className="text-white no-underline" to="/carro-de-compra">
                  Carrito
                  {cartItemCount > 0 && (
                    <div className="xl:ml-[70px] xl:-mt-10 lg:ml-[55px] absolute -mt-8 ml-10 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                      {cartItemCount}
                    </div>
                  )}
                </Link>
              </li>
              <li
                className="min-[320px]:hidden lg:block
          xl:text-[25px] list-none text-white tracking-wide"
              >
                <Link className="text-white no-underline" to="/usuarios">
                  Panel de Control
                </Link>{" "}
              </li>
            </>
          )}
          {userRole === "cliente" && (
            <>
              <li className="xl:text-[25px] list-none text-white tracking-wide">
                <Link className="text-white no-underline" to="/catalogo">
                  Productos
                </Link>
              </li>
              <li className="xl:text-[25px] list-none text-white tracking-wide">
                <Link className="text-white no-underline" to="/carro-de-compra">
                  Carrito
                  {cartItemCount > 0 && (
                    <div className="xl:ml-[70px] xl:-mt-10 lg:ml-[55px] absolute -mt-8 ml-10 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                      {cartItemCount}
                    </div>
                  )}
                </Link>
              </li>
            </>
          )}
          {userRole === null && (
            <>
              <li className="xl:text-[25px] list-none text-white tracking-wide">
                <Link className="text-white no-underline" to="/">
                  Inicio
                </Link>
              </li>
              <li className="xl:text-[25px] list-none text-white tracking-wide">
                <Link className="text-white no-underline" to="/catalogo">
                  Productos
                </Link>
              </li>
              <li className="xl:text-[25px] list-none text-white tracking-wide">
                <Link className="text-white no-underline" to="/carro-de-compra">
                  Carrito
                  {cartItemCount > 0 && (
                    <div className="xl:ml-[70px] xl:-mt-12 lg:ml-[55px] md:-mt-14 md:ml-[60px] md:w-7 md:h-7 absolute -mt-8 ml-10 bg-white text-black w-5 h-5 rounded-full flex items-center justify-center">
                      {cartItemCount}
                    </div>
                  )}
                </Link>
              </li>
              <li
                className="min-[320px]:hidden lg:block
                xl:text-[25px] list-none text-white tracking-wide"
              >
                <Link className="text-white no-underline" to="/iniciar-sesion">
                  Iniciar Sesión
                </Link>{" "}
              </li>
              <li
                className="min-[320px]:hidden lg:block
                xl:text-[25px]  list-none text-white tracking-wide"
              >
                <Link className="text-white no-underline" to="/registrarse">
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </div>
      </div>
    </>
  );
};
