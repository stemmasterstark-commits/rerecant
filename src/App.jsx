import { useState } from "react";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (currentPage === "orders") {
    return <Orders onNavigate={handleNavigate} />;
  }

  if (currentPage === "cart") {
    return <Cart onNavigate={handleNavigate} />;
  }

  return <Home onNavigate={handleNavigate} />;
}

export default App;