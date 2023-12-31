import { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { AiFillDelete, AiFillPlusSquare } from 'react-icons/ai'
import sectionApi from '../api/sectionApi'
import taskApi from '../api/taskApi'
import TaskModal from './TaskModal'

let timer
const timeout = 500

const Kanban = props => {
  const boardId = props.boardId
  const [data, setData] = useState([])
  const [selectedTask, setSelectedTask] = useState(undefined)

  const [isDragging, setIsDragging] = useState(false);

  const handleDeleteShow = () => {
    setIsDragging(true);
  };


  useEffect(() => {
    setData(props.data)
  }, [props.data])

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result
    if (!destination) return

    const sourceColIndex = data.findIndex(e => e.id === source.droppableId)
    const sourceCol = data[sourceColIndex]
    const sourceSectionId = sourceCol.id
    const sourceTasks = [...sourceCol.tasks]

    setIsDragging(false)
    // If dropped outside the droppable area, remove the item

    if (destination.droppableId === 'trash') {
      const taskId = draggableId
      const sectionId = source.droppableId
      delTask(taskId, sectionId)
      return;
    }

    const destinationColIndex = data.findIndex(e => e.id === destination.droppableId)
    const destinationCol = data[destinationColIndex]
    const destinationSectionId = destinationCol.id
    const destinationTasks = [...destinationCol.tasks]

    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceTasks.splice(source.index, 1)
      destinationTasks.splice(destination.index, 0, removed)
      data[sourceColIndex].tasks = sourceTasks
      data[destinationColIndex].tasks = destinationTasks
    } else {
      const [removed] = destinationTasks.splice(source.index, 1)
      destinationTasks.splice(destination.index, 0, removed)
      data[destinationColIndex].tasks = destinationTasks
    }

    try {
      await taskApi.updatePosition(boardId, {
        resourceList: sourceTasks,
        destinationList: destinationTasks,
        resourceSectionId: sourceSectionId,
        destinationSectionId: destinationSectionId
      })
      setData(data)
    } catch (err) {
      alert(err)
    }
  }

  const createSection = async () => {
    try {
      const section = await sectionApi.create(boardId)
      setData([...data, section])
    } catch (err) {
      alert(err)
    }
  }

  const deleteSection = async (sectionId) => {
    try {
      await sectionApi.delete(boardId, sectionId)
      const newData = [...data].filter(e => e.id !== sectionId)
      setData(newData)
    } catch (err) {
      alert(err)
    }
  }

  const updateSectionTitle = async (e, sectionId) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    const newData = [...data]
    const index = newData.findIndex(e => e.id === sectionId)
    newData[index].title = newTitle
    setData(newData)
    timer = setTimeout(async () => {
      try {
        await sectionApi.update(boardId, sectionId, { title: newTitle })
      } catch (err) {
        alert(err)
      }
    }, timeout);
  }

  const createTask = async (sectionId) => {
    try {
      const task = await taskApi.create(boardId, { sectionId })
      const newData = [...data]
      const index = newData.findIndex(e => e.id === sectionId)
      newData[index].tasks.unshift(task)
      setData(newData)
    } catch (err) {
      alert('createTask kanban:' + JSON.stringify(err))
    }
  }

  const onUpdateTask = (task) => {
    const newData = [...data]
    const sectionIndex = newData.findIndex(e => e.id === task?.section?.id)
    const taskIndex = newData[sectionIndex]?.tasks?.findIndex(e => e.id === task?.id)
    newData[sectionIndex].tasks[taskIndex] = task
    setData(newData)
  }

  const onDeleteTask = (task) => {
    const newData = [...data]
    const sectionIndex = newData.findIndex(e => e.id === task.section.id)
    const taskIndex = newData[sectionIndex].tasks.findIndex(e => e.id === task.id)
    newData[sectionIndex].tasks.splice(taskIndex, 1)
    setData(newData)
  }

  const delTask = async (taskId, sectionId) => {
    try {
      await taskApi.delete(sectionId, taskId)
      const newData = [...data]
      const sectionIndex = newData.findIndex(e => e.id === sectionId)
      const taskIndex = newData[sectionIndex].tasks.findIndex(e => e.id === taskId)
      newData[sectionIndex].tasks.splice(taskIndex, 1)
      setData(newData)
      setSelectedTask(undefined)
    } catch (err) {
      alert(err)
    }
  }


  return (
    <>
      <div className="flex items-center justify-between">
        <button type='button' className='text-md text-blue-800 dark:text-blue-400' onClick={createSection}>Add Section</button>
        <span className='text-md text-black dark:text-white'>{data.length} Sections</span>
      </div>
      <hr className='mt-1 mb-3 w-[85%] mx-auto' />

      {/* drag and drop  */}
      <DragDropContext onDragEnd={onDragEnd} onDragStart={handleDeleteShow}>
        <div className="flex flex-col">
          <div className="flex flex-start w-[calc(100vw -400px)] overflow-x-auto  z-20">

            {
              data.map(section => (
                <div key={section.id} className='w-[300px]'>
                  <Droppable key={section.id} droppableId={section.id}>
                    {
                      (provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className='w-300 p-3 mr-3'
                        >
                          <div className='flex items-center justify-between mb-3' >
                            <input type='text'
                              value={section?.title}
                              onChange={(e) => updateSectionTitle(e, section.id)}
                              placeholder='Untitled'
                              className='flex flex-1 appearance-none w-[200px] rounded p-1 text-2xl text-slate-900 bg-inherit  dark:text-white font-bold tracking-tight '
                            />
                            <button type='button' className='text-xl text-gray-500 hover:text-green-500'
                              onClick={() => createTask(section.id)}
                            >
                              < AiFillPlusSquare />
                            </button>
                            <button type='button' className='text-xl text-gray-500 hover:text-red-600'
                              onClick={() => deleteSection(section.id)}

                            >
                              < AiFillDelete />
                            </button>
                          </div>
                          {/* tasks */}
                          {
                            section.tasks.map((task, index) => (
                              <Draggable key={task?.id} draggableId={task?.id} index={index}>
                                {(provided, snapshot) => (
                                  <>
                                    <div className={`block rounded-lg hover:bg-white bg-gray-100 px-6 py-1 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 mt-2 dark:hover:bg-neutral-800 z-30 overflow-hidden`}
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <div className={`flex relative justify-between items-center}`}>
                                        <div className='center gap-1' onClick={() => setSelectedTask(task)}>
                                          <span>😎</span>
                                          {/* <EmojiPicker icon={icon} onChange={onIconChange} onClick={clickEmoji} /> */}

                                          <h5 className={`mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50  ${snapshot.isDragging ? 'cursor-grab' : 'cursor-pointer'}`}

                                          >
                                            {task?.title === '' ? 'Untitled' : task?.title}
                                          </h5>
                                        </div>
                                        <button type='button' className='text-2xl text-gray-500 hover:text-red-600'
                                          onClick={() => delTask(task?.id, section?.id)}
                                        >
                                          < AiFillDelete />
                                        </button>
                                      </div>
                                    </div>
                                  </>
                                )
                                }
                              </Draggable>
                            ))
                          }
                          {provided.placeholder}
                        </div>
                      )

                    }
                  </Droppable>
                </div>
              ))
            }
          </div>
          <Droppable droppableId="trash">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  width: '25%',
                  padding: '1rem',
                  border: '1px solid #ccc',
                  backgroundColor: 'red',
                  color: 'white',
                  opacity: 0.45,
                }}
                className={`${isDragging ? 'center' : 'hidden'} fixed bottom-4 rounded-full left-[calc(40%)]`}
              >
                < AiFillDelete />
                {provided.placeholder}
              </div>
            )}
          </Droppable>

        </div >
      </DragDropContext >

      <TaskModal
        task={selectedTask}
        boardId={boardId}
        onClose={() => setSelectedTask(undefined)}
        onUpdate={onUpdateTask}
        onDelete={onDeleteTask}
      />
    </>
  )
}

export default Kanban