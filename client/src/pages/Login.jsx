import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import authApi from '../api/authApi'
const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [usernameErrText, setUsernameErrText] = useState('')
  const [passwordErrText, setPasswordErrText] = useState('')
  const [credError, setCredError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUsernameErrText('')
    setPasswordErrText('')

    const form = new FormData()
    form.append(e.target[0].name, e.target[0].value)
    form.append(e.target[1].name, e.target[1].value)
    // console.log([...form.entries()])
    const username = form.get('username').trim()
    const password = form.get('password').trim()

    let err = false

    if (username === '') {
      err = true
      setUsernameErrText('Please fill this field')
    }
    if (password === '') {
      err = true
      setPasswordErrText('Please fill this field')
    }

    if (err) return

    setLoading(true)

    try {
      const res = await authApi.login({ username, password })
      setLoading(false)
      localStorage.setItem('token', res.token)
      localStorage.setItem('currentUser', JSON.stringify(res.user))
      navigate('/boards')
    } catch (err) {
      const errors = err?.data?.errors
      if (errors?.length == 1) {
        setCredError("Wrong credentials")
        setTimeout(() => {
          setCredError('')
        }, 2500);
      }

      errors?.forEach(e => {
        if (e?.path === 'username') {
          setUsernameErrText(e.msg)
        }
        if (e?.path === 'password') {
          setPasswordErrText(e.msg)
        }
      })
      setLoading(false)
    }
  }

  return (
    <>
      {loading ? <Loader /> : <form className='center flex-col m-auto w-full max-w-sm flex-1 p-4' onSubmit={handleSubmit}>
        <div className="mb-6 w-[100%]">
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
          <input type="text"
            name='username'
            id="username"
            autoComplete=''
            className={`shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light ${loading ? 'cursor-not-allowed' : 'cursor-default'}`} placeholder="name@flowbite.com" required
            disabled={loading}
          />
          {/* input disabled while in loading */}
          {usernameErrText && (<div className="flex text-left text-red-700 dark:text-red-400 mt-1 text-sm">{usernameErrText}</div>)}
        </div>


        <div className="mb-6 w-[100%]">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
          <input
            type="password"
            name='password'
            id="password"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            required
            disabled={loading}
          />
          {passwordErrText && (<div className="text-red-700 dark:text-red-400 mt-1 text-sm">{passwordErrText}</div>)}
        </div>
        <button type="submit" className="btn btn-hipster dark:bg-gray-800 dark:text-white dark:hover:bg-gray-950">Login</button>

        <label htmlFor="terms" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Don't have an account? <Link to='/signup' className="text-blue-600 hover:underline dark:text-blue-500">SignUp</Link></label>

        {credError && <div className='py-[2px] w-full px-2 rounded-md text-sm mt-3 bg-red-200 text-red-80'>Invalid username or password</div>}
      </form>}

    </>
  )
}

export default Login