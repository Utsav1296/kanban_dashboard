import { useState } from "react"
import { useDispatch } from "react-redux"
import { setBoards } from "../redux/features/boardSlice"
import { useNavigate } from "react-router-dom"
import Loader from '../components/Loader'
import boardApi from "../api/boardApi"

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isloading, setIsLoading] = useState(false)

  const createBoard = async () => {
    setIsLoading(true)
    try {
      const res = await boardApi.create()
      console.log("🚀 ~ file: Home.jsx:17 ~ createBoard ~ res:", res)
      dispatch(setBoards([res]))
      navigate(`/boards/${res.id}`)
    } catch (err) {
      alert(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='center bg-gray-100 text-gray-900 p-4 w-[100%] h-[100vh] text-3xl  dark:text-gray-200 dark:bg-gray-900'>
      {isloading ? <Loader /> :
        (
          <div className="center h-[100%] ">
            <button
              onClick={createBoard}
              type="button"
              className="rounded bg-green-700 px-8 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-green-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-green-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            >
              Click here to create your first board
            </button>
          </div>
        )
      }
    </div>
  )
}

export default Home