import React from 'react'
import darkModeLogo from '/dark-icon.svg'
// import { RxReset } from "react-icons/fa";
import { VscDebugRestart } from "react-icons/vsc";


const Navbar = (props) => {
  return (
    <div className='flex flex-row justify-end px-3 py-1 mb-auto'>
      <button onClick={props.toggleDarkMode} className='flex flex-row gap-x-2 border text-black border-black rounded-xl px-2 py-1 shadow-md bg-[#b8c1ec] dark:bg-slate-700 dark:border-white dark:text-white'>
        <div >Dark Mode</div>
        <img className='w-6 dark:invert' src={darkModeLogo} alt="mylogo" /> 
        </button>
    </div>
  )
}

export default Navbar