import { useEffect, useState } from 'react'
import { AiFillDelete, AiOutlineStar, AiFillStar } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import boardApi from '../api/boardApi'
import EmojiPicker from '../components/EmojiPicker'
import Kanban from '../components/Kanban'
import { setBoards } from '../redux/features/boardSlice'
import { setFavouriteList } from '../redux/features/favouriteSlice'
import section from '../../../server/models/section.js'

let timer
const timeout = 500
const Board = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { boardId } = useParams()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sections, setSections] = useState([])
  const [isFavourite, setIsFavourite] = useState(false)
  const [icon, setIcon] = useState('')

  const boards = useSelector((state) => state.board.value)
  const favouriteList = useSelector((state) => state.favourites.value)

  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await boardApi.getOne(boardId)
        setTitle(res?.title)
        setDescription(res?.description)
        setSections(res?.sections)
        setIsFavourite(res?.favourite)
        setIcon(res?.icon)
      } catch (err) {
        alert('GetBoardErr :' + err)
      }
    }
    getBoard()
  }, [boardId])

  const onIconChange = async (newIcon) => {
    let temp = [...boards]
    const index = temp.findIndex(e => e.id === boardId)
    temp[index] = { ...temp[index], icon: newIcon }

    if (isFavourite) {
      let tempFavourite = [...favouriteList]
      const favouriteIndex = tempFavourite.findIndex(e => e.id === boardId)
      tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], icon: newIcon }
      dispatch(setFavouriteList(tempFavourite))
    }
    setIcon(newIcon)
    dispatch(setBoards(temp))
    try {
      await boardApi.update(boardId, { icon: newIcon })
    } catch (err) {
      alert(err)
    }
  }


  const updateTitle = async (e) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    setTitle(newTitle)
    let temp = [...boards]
    const index = temp.findIndex(e => e.id === boardId)
    temp[index] = { ...temp[index], title: newTitle }

    if (isFavourite) {
      let tempFavourite = [...favouriteList]
      const favouriteIndex = tempFavourite.findIndex(e => e.id === boardId)
      tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], title: newTitle }
      dispatch(setFavouriteList(tempFavourite))
    }

    dispatch(setBoards(temp))

    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { title: newTitle })
      } catch (err) {
        alert(err)
      }
    }, timeout);
  }

  const updateDescription = async (e) => {
    clearTimeout(timer)
    const newDescription = e.target.value
    setDescription(newDescription)
    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { description: newDescription })
      } catch (err) {
        alert(err)
      }
    }, timeout);
  }

  const addFavourite = async () => {
    try {
      const board = await boardApi.update(boardId, { favourite: !isFavourite })
      let newFavouriteList = [...favouriteList]
      if (isFavourite) {
        newFavouriteList = newFavouriteList.filter(e => e.id !== boardId)
      } else {
        newFavouriteList.unshift(board)
      }
      dispatch(setFavouriteList(newFavouriteList))
      setIsFavourite(!isFavourite)
    } catch (err) {
      alert(err)
    }
  }

  const deleteBoard = async () => {
    try {
      await boardApi.delete(boardId)
      if (isFavourite) {
        const newFavouriteList = favouriteList.filter(e => e.id !== boardId)
        dispatch(setFavouriteList(newFavouriteList))
      }

      const newList = boards.filter(e => e.id !== boardId)
      if (newList.length === 0) {
        navigate('/boards')
      } else {
        navigate(`/boards/${newList[0].id}`)
      }
      dispatch(setBoards(newList))
    } catch (err) {
      alert(err)
    }
  }
  const clickEmoji = () => {
    console.log('emoji clicked')
  }

  return (
    <div className="bg-gray-100 text-gray-900 p-4 w-[100%] h-[100vh] dark:text-gray-200 dark:bg-gray-900">

      <div className="max-w-7xl">
        <div className="flex items-center justify-between w-full">
          <button
            className={`center border h-8 w-8 bg-gray-200 dark:bg-gray-800 border-solid rounded p-1 
          ${isFavourite ? 'text-yellow-600 dark:text-yellow-200' : 'text-gray-900 dark:text-gray-100'}`}
            onClick={addFavourite}
          >
            {isFavourite ? (
              <AiFillStar />
            ) : (
              <AiOutlineStar />
            )}
          </button>
          <button className="center h-8 w-8 text-red-600 bg-gray-200 dark:bg-gray-800 border border-solid rounded p-1 text-error" onClick={deleteBoard}>
            <AiFillDelete />
          </button>
        </div>

        {/* featured */}
        <div className="py-2 px-10">
          <div className="bg-white mt-2 dark:bg-slate-800 rounded-lg px-6 py-3 ring-1 ring-slate-900/5 shadow-xl">
            <div className="flex gap-2">
              <EmojiPicker icon={icon} onChange={onIconChange} onClick={clickEmoji} />
              <input
                type='text'
                value={title}
                onChange={updateTitle}
                placeholder="Untitled"
                className=" w-full rounded p-1 text-2xl text-slate-900 bg-inherit  dark:text-white font-bold tracking-tight appearance-none"
              />
            </div>
            <textarea
              value={description}
              onChange={updateDescription}
              placeholder="Add a description"
              className="text-slate-500 border-none bg-inherit dark:text-slate-400 p-2 mt-2 text-sm w-full appearance-none"
              rows={4}
            />
          </div>
        </div>
      </div>
      {/* Kanban board */}
      <div className='mt-4'>
        <Kanban data={sections} boardId={boardId} />
      </div>
    </div>
  )
}

export default Board