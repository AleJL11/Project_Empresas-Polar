import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Usuario
  const [userRole, setUserRole] = useState(null);
  const [imgUser, setImgUser] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userLastName, setUserLastName] = useState(null);
  const [userDNI, setDNI] = useState(null);
  const [userEmail, setEmail] = useState(null);
  const [userNroTlf, setNroTlf] = useState(null);
  const [userDirection, setDirection] = useState(null);
  const [userPassword, setPassword] = useState(null);
  const [userId, setId] = useState(null);

  // Carrito
  const [cart, setCart] = useState([]);

  const setRole = (role) => {
    setUserRole(role);
  };

  const setImg = (img) => {
    setImgUser(img);
  };

  const setUser = (user) => {
    setUserName(user);
  };

  const setLastName = (lastName) => {
    setUserLastName(lastName);
  };

  const setCedula = (cedula) => {
    setDNI(cedula);
  };

  const setUserEmail = (correo) => {
    setEmail(correo);
  };

  const setTlf = (tlf) => {
    setNroTlf(tlf);
  };

  const setDireccion = (direccion) => {
    setDirection(direccion);
  };

  const setClave = (clave) => {
    setPassword(clave);
  }

  const setID = (id) => {
    setId(id);
  };

  // Carrito
  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
  };

  return (
    <AuthContext.Provider
      value={{
        userRole,
        imgUser,
        userName,
        cart,
        userLastName,
        userDNI,
        userEmail,
        userNroTlf,
        userDirection,
        userPassword,
        userId,
        setRole,
        setImg,
        setUser,
        addToCart,
        updateCart,
        setLastName,
        setCedula,
        setUserEmail,
        setTlf,
        setDireccion,
        setClave,
        setID,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
