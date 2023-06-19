import { useState } from "react";

const Modal = () => {
   const [showModal, setShowModal] = useState(false);
   const deleteTask = () => {

   }
   return (
      <>
         <button
            className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => setShowModal(true)}
         >
            Open regular modal
         </button>

         {showModal ? (
            <>
               <div
                  className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
               >
                  <div className="relative w-auto my-6 mx-auto max-w-3xl">
                     {/*content*/}
                     <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                           <h3 className="text-3xl font-semibold">
                              Modal Title
                           </h3>
                           <button
                              className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                              onClick={() => setShowModal(false)}
                           >
                              <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                 ×
                              </span>
                           </button>
                        </div>
                        {/*body*/}
                        <div className='flex items-center justify-end w-[100%]'>
                           <button type="button" onClick={deleteTask} className='text-red-500'>
                              <AiFillDelete />
                           </button>

                           <div className="flex flex-col h-[100%] pt-8 px-20 pb-20">

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
                           <div className='relative w=[80%] overflow-y-auto overflow-x-hidden'>
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
                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                           <button
                              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={() => setShowModal(false)}
                           >
                              Close
                           </button>
                           <button
                              className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={() => setShowModal(false)}
                           >
                              Save Changes
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
         ) : null}
      </>

   );
}

export default Modal


