import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import authApi from '../api/authApi'

const Signup = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [usernameErrText, setUsernameErrText] = useState('')
  const [passwordErrText, setPasswordErrText] = useState('')
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUsernameErrText('')
    setPasswordErrText('')
    setConfirmPasswordErrText('')

    const form = new FormData(e.target)
    const username = form.get('username').trim()
    const password = form.get('password').trim()
    const confirmPassword = form.get('confirmPassword').trim()

    let err = false

    if (username === '') {
      err = true
      setUsernameErrText('Please fill this field')
    }
    if (password === '') {
      err = true
      setPasswordErrText('Please fill this field')
    }
    if (confirmPassword === '') {
      err = true
      setConfirmPasswordErrText('Please fill this field')
    }
    if (password !== confirmPassword) {
      err = true
      setConfirmPasswordErrText('Confirm password not match')
    }

    if (err) return

    setLoading(true)

    try {
      const res = await authApi.signup({
        username, password, confirmPassword
      })
      setLoading(false)
      navigate('/')
    } catch (err) {
      console.log(err);
      const errs = err.data.errors
      errs.forEach(e => {
        console.log(e)
        if (e.path === 'username') {
          setUsernameErrText(e.msg)
        }
        if (e.path === 'password') {
          setPasswordErrText(e.msg)
        }
        if (e.path === 'confirmPassword') {
          setConfirmPasswordErrText(e.msg)
        }
      })
      setLoading(false)
    }
  }



  return (
    <>
      {loading ? <Loader /> : <form className='center flex-col m-auto w-full max-w-sm flex-1 p-4' autoComplete='on' onSubmit={handleSubmit}>
        <div className="mb-6 w-[100%]">
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
          <input type="text" name='username' id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="name@flowbite.com" required autoComplete='on' />
          {usernameErrText && (<div className="text-red-700 dark:text-red-400 mt-1 text-sm">{usernameErrText}</div>)}
        </div>
        <div className="mb-6 w-[100%]">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
          <input type="password" name='password' id="password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
          {passwordErrText && (<div className="text-red-700 dark:text-red-400 mt-1 text-sm">{passwordErrText}</div>)}
        </div>
        <div className="mb-6 w-[100%]">
          <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
          <input type="password" name='confirmPassword' id="repeat-password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
          {confirmPasswordErrText && (<div className="text-red-700 dark:text-red-400 mt-1 text-sm">{confirmPasswordErrText}</div>)}
        </div>
        <div className="flex items-start mb-6">
        </div>
        <button type="submit" className="btn btn-hipster dark:bg-gray-800 dark:text-white dark:hover:bg-gray-950">Sign Up</button>

        <label htmlFor="terms" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Already have an account? <Link to='/login' className="text-blue-600 hover:underline dark:text-blue-500">Login</Link></label>
      </form>}
    </>
  )
}

export default Signup