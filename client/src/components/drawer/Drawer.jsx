import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AiOutlineClose, AiOutlineMenuFold, AiOutlineUser, AiOutlineTable, AiOutlineOrderedList, AiOutlineLogout, AiOutlinePlusSquare } from 'react-icons/ai'
import ThemeSwitch from '../ThemeSwitch';
import boardApi from '../../api/boardApi'
import { setBoards } from '../../redux/features/boardSlice'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import FavouriteList from '../FavouriteList'



import { useSelector, useDispatch } from 'react-redux'
import { MdDarkMode, MdLightMode } from 'react-icons/md'
import './Drawer.css'
const Drawer = () => {
   const [isOpen, setIsOpen] = useState(false);
   const handleTrigger = () => setIsOpen(!isOpen);
   const [width, setWidth] = useState('')
   const navigate = useNavigate()

   const user = useSelector((state) => state.user.value)
   const boards = useSelector((state) => state.board.value)
   const dispatch = useDispatch()
   const { boardId } = useParams()
   const [activeIndex, setActiveIndex] = useState(0)

   useEffect(() => {
      const classWidth = isOpen ? 'w-[250px]' : 'w-12'
      setWidth(classWidth)
   }, [isOpen])

   const logoutHandler = () => {
      localStorage.removeItem('currentUser')
      localStorage.removeItem("token");

      navigate('/login')
   }

   useEffect(() => {
      const getBoards = async () => {
         try {
            const res = await boardApi.getAll()
            console.log(res)
            dispatch(setBoards(res))
         } catch (err) {
            alert(err)
         }
      }
      getBoards()
   }, [dispatch])

   useEffect(() => {
      const activeItem = boards?.findIndex(e => e.id === boardId)
      if (boards.length > 0 && boardId === undefined) {
         navigate(`/boards/${boards[0].id}`)
      }
      setActiveIndex(activeItem)
   }, [boards, boardId, navigate])

   const onDragEnd = async ({ source, destination }) => {
      const newList = [...boards]
      const [removed] = newList.splice(source.index, 1)
      newList.splice(destination.index, 0, removed)

      const activeItem = newList.findIndex(e => e.id === boardId)
      setActiveIndex(activeItem)
      dispatch(setBoards(newList))

      try {
         await boardApi.updatePosition({ boards: newList })
      } catch (err) {
         console.log("🚀 ~ file: Drawer.jsx:72 ~ onDragEnd ~ err:", err)
         alert(err)
      }
   }

   const addBoard = async () => {
      try {
         const res = await boardApi.create()
         const newList = [res, ...boards]
         dispatch(setBoards(newList))
         navigate(`/boards/${res.id}`)
      } catch (err) {
         console.log("🚀 ~ file: Drawer.jsx:84 ~ addBoard ~ err:", err)
         alert(err)
      }
   }

   return (
      <div className={`flex ${width}`}>
         <div className={`sidebar relative ${isOpen ? "sidebar--open" : ""} overflow-auto`}>
            <div className="trigger" onClick={handleTrigger}>
               {isOpen ? <AiOutlineClose /> : <AiOutlineMenuFold />}
            </div>

            <div className="sidebar-position">
               <AiOutlineUser />
               {isOpen && <Link to='/boards' className='text-white'>Home</Link>}
            </div>

            <div className="sidebar-position" onClick={addBoard}>
               <AiOutlinePlusSquare />
               <span>Add Board</span>
            </div>

            {/* draggable and droppable  */}
            {isOpen && (<DragDropContext onDragEnd={onDragEnd}>
               <Droppable key={'list-board-droppable-key'} droppableId={'list-board-droppable'}>
                  {(provided) => (
                     <div ref={provided.innerRef} {...provided.droppableProps}>
                        {
                           boards?.map((item, index) => (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                 {(provided, snapshot) => (
                                    <Link className={`flex font-bold pl-8 mt-1 text-gray-300 ${snapshot.isDragging ? 'cursor-grab' : 'cursor-pointer'} text-ellipsis overflow-auto`}
                                       ref={provided.innerRef}
                                       {...provided.dragHandleProps}
                                       {...provided.draggableProps}
                                       selected={index === activeIndex}
                                       to={`/boards/${item.id}`}
                                    >
                                       {item.icon} {item.title}
                                    </Link>
                                 )}
                              </Draggable>
                           ))
                        }
                        {provided.placeholder}
                     </div>
                  )}
               </Droppable>
            </DragDropContext>)}

            <div className="flex flex-col bg-gray-900 absolute bottom-0 w-full">

               <div className="sidebar-position" >
                  <ThemeSwitch />
               </div>
               <div className="sidebar-position" onClick={logoutHandler}>
                  <AiOutlineLogout />
                  <span className='capitalize'>{user.username}</span>
               </div>
            </div>
         </div >
      </div >
   )
}

export default Drawer 