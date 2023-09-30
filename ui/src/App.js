import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Auth from "./containers/auth/auth.js"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/clientAuth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App