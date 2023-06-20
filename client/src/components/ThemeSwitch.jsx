import React, { useEffect, useRef, useState } from 'react'

import { MdDarkMode, MdLightMode } from 'react-icons/md'


const ThemeSwitch = () => {
   const [isDark, setIsDark] = useState(false)
   //Icon selector
   const sunIcon = useRef(null)
   const moonIcon = useRef(null)

   // Theme variables 
   const userTheme = localStorage.getItem('theme')
   const systemTheme = window.matchMedia("(prefers-color-scheme:dark)").matches

   //Initial Theme checking
   const themeCheck = () => {
      if (userTheme === 'dark' || (!userTheme && systemTheme)) {
         document.documentElement.classList.add('dark')
         setIsDark(true)
         return;
      }
      setIsDark(false)
   }

   useEffect(() => {
      themeCheck()
   }, [])


   // manual
   const themeSwitch = () => {
      if (document.documentElement.classList.contains('dark')) {
         document.documentElement.classList.remove('dark')
         localStorage.setItem('theme', 'light')
         setIsDark(false)
         return;
      }
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
   }


   return (
      <>
         <button className={`sun ${isDark ? 'flex' : 'hidden'}`} ref={sunIcon} onClick={themeSwitch}>
            <MdLightMode className='h-6 w-6 rounded-full' />
         </button>
         <div className={`moon ${isDark ? 'hidden' : 'flex'}`} ref={moonIcon} onClick={themeSwitch}>
            <MdDarkMode className='h-6 w-6 rounded-full' />
         </div>
      </>
   )
}

export default ThemeSwitch