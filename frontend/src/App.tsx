
import './App.css'

import Dashboard from './pages/Dashboard'
import { Navigate, BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to={"/dashboard"}/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
