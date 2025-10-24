import { Route, Routes } from "react-router-dom";
import MainLayout from "./MainLayout.jsx";
import Home from "./pages/Home.jsx";

function App() {

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App
