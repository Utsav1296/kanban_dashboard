import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import authUtils from '../utils/authUtils'
import Loader from '../components/Loader'

const AuthLayout = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const dark = (localStorage.getItem('theme') == 'dark')

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuthenticated()
      if (!isAuth) {
        setLoading(false)
      } else {
        navigate('/')
      }
    }
    checkAuth()
  }, [navigate])

  return (
    loading ? (
      <Loader />
    ) : (
      <div>
        <div component='main' className=' p-12 h-[100dvh] flex flex-col bg-gray-100 dark:bg-gray-600' >
          <div className="mt-12 mb-8 flex flex-col justify-center items-center">
            <img src={`${dark ? '/logo-dark.png' : '/logo-light.png'}`} style={{ width: '100px', height: '30px' }} alt='app logo' />
          </div>
          <Outlet />
        </div>
      </div>
    )
  )
}

export default AuthLayout