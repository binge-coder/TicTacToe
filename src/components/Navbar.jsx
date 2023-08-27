import React from 'react'
import darkModeLogo from '/dark-icon.svg'

const Navbar = (props) => {
  return (
    <div className='flex flex-row justify-end p-3 mb-auto border border-black'>
      <button onClick={props.toggleDarkMode} className='flex flex-row gap-x-2 border border-black rounded-xl px-2 dark:border-white'>
        <div >Dark Mode</div>
        <img className='w-6 dark:invert' src={darkModeLogo} alt="mylogo" /> 
        </button>
    </div>
  )
}

export default Navbar