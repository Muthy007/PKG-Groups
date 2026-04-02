import './App.css'
import Navbar from './Components/Layouts/Navbar'
import Home from './Components/Layouts/Home'
import Footer from './Components/Layouts/Footer'
import { Route, Routes } from 'react-router-dom'
import StatsPage from './Components/Layouts/StatsPage'

function App() {
  return (
    <>
    
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </>
  )
}

export default App
