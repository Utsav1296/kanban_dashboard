import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import authUtils from '../utils/authUtils'
import Loader from '../components/Loader'
import Drawer from '../components/drawer/Drawer'

import { setUser } from '../redux/features/userSlice'

const AppLayout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authUtils.isAuthenticated()
      if (!user) {
        navigate('/login')
      } else {
        // save user
        dispatch(setUser(user))
        setLoading(false)
      }
    }
    checkAuth()
  }, [navigate])

  return (
    loading ? (
      <Loader />
    ) : (
      <div className='flex ease-linear'>
        {/* sidebar  */}
        <Drawer />
        <div className='w-max flex flex-1 ease-linear'>
          <Outlet />
        </div>
      </div>
    )
  )
}

export default AppLayout