import React, { useEffect, useRef, useState } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import Moment from 'moment'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import taskApi from '../api/taskApi'

import '../css/custom-editor.css'
let timer
const timeout = 500
let isModalClosed = false

const TaskModal = props => {
  const boardId = props.boardId
  const [task, setTask] = useState(props.task)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  // const [showModal, setShowModal] = useState(!isModalClosed);
  const editorWrapperRef = useRef()

  useEffect(() => {
    setTask(props.task)
    setTitle(props.task !== undefined ? props.task.title : '')
    setContent(props.task !== undefined ? props.task.content : '')
    if (props.task !== undefined) {
      isModalClosed = false

      updateEditorHeight()
    }
  }, [props.task])

  const updateEditorHeight = () => {
    setTimeout(() => {
      if (editorWrapperRef.current) {
        const box = editorWrapperRef.current
        box.querySelector('.ck-editor__editable_inline').style.height = (box.offsetHeight - 50) + 'px'
      }
    }, timeout)
  }

  const onClose = () => {
    isModalClosed = true
    props.onUpdate(task)
    props.onClose()
  }

  const deleteTask = async () => {
    try {
      await taskApi.delete(boardId, task.id)
      props.onDelete(task)
      setTask(undefined)
    } catch (err) {
      alert(err)
    }
  }

  const updateTitle = async (e) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    timer = setTimeout(async () => {
      try {
        await taskApi.update(boardId, task.id, { title: newTitle })
      } catch (err) {
        alert(err)
      }
    }, timeout)

    task.title = newTitle
    setTitle(newTitle)
    props.onUpdate(task)
  }

  const updateContent = async (event, editor) => {
    clearTimeout(timer)
    const data = editor.getData()
    if (!isModalClosed) {
      timer = setTimeout(async () => {
        try {
          await taskApi.update(boardId, task.id, { content: data })
        } catch (err) {
          alert(err)
        }
      }, timeout);

      task.content = data
      setContent(data)
      props.onUpdate(task)
    }
  }
  return (
    <div >
      <>
        {/* <button
          className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => setShowModal(true)}
        >
          Open regular modal
        </button> */}
        {(!isModalClosed && task) ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-auto overflow-y-auto fixed inset-0 z-40 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-gray-800 outline-none focus:outline-none">
                  {/*body*/}
                  <div className='flex flex-col items-start p-2 w-[100%]'>

                    <div className="flex gap-8 flex-row-reverse h-[100%] pt-8 px-4 pb-2">
                      <button type="button" onClick={deleteTask} className='text-red-500'>
                        <AiFillDelete />
                      </button>

                      <input
                        type='text'
                        value={title}
                        onChange={updateTitle}
                        placeholder="Untitled"
                        className=" w-full rounded p-1 text-2xl text-slate-900 bg-inherit  dark:text-white font-bold tracking-tight appearance-none"
                      />
                      <span className='text-slate-900 bg-inherit  dark:text-white font-bold text-xl'>{task !== undefined ? Moment(task.createdAt).format('YYYY-MM-DD') : ''}</span>
                    </div>
                    <hr className='w-[80%] my-6' />
                    <div className='relative flex flex-wrap w-[90%] text-wrap overflow-x-auto
                     md:overflow-x-hidden mx-auto text-gray-600 font-normal'
                      ref={editorWrapperRef}
                    >
                      <CKEditor
                        editor={ClassicEditor}
                        data={content}
                        onChange={updateContent}
                        onFocus={updateEditorHeight}
                        onBlur={updateEditorHeight}
                      />
                    </div>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-2 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-1 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={onClose}
                    >
                      Close
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={onClose}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-75 fixed inset-0 z-30 bg-black"></div>
          </>
        ) : null}
      </>
    </div>
  )
}

export default TaskModal