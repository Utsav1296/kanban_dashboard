// import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './wrapper/AppLayout'
import AuthLayout from './wrapper/AuthLayout'
import Home from './pages/Home'
import Board from './pages/Board'
import Signup from './pages/Signup'
import Login from './pages/Login'
// import { fetchUser } from './utils/fetchUser'
import './css/App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
        </Route>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path='boards' element={<Home />} />
          <Route path='boards/:boardId' element={<Board />} />
          <Route path='boards/123' element={<Board />} />
        </Route>

      </Routes>
    </>
  )
}

export default App
