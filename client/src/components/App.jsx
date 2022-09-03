import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./auth/login/Login";
import Error404 from "./common/Error404";
import Menu2 from "./dashboard/static/Menu2";

function App({ loggedIn }) {
  return (
    <div className=" ">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu2 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </div>
  );
}

export default App;
