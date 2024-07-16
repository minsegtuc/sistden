import React from 'react'

const Nav = () => {
    return (
        <nav className='bg-[#345071] h-20 w-full flex flex-row justify-between items-center'>
            <div className='flex flex-row gap-2 items-center pl-12'>
                <img src="/img_logo.svg" alt="" className='w-52'/>
            </div>
            <div className='pr-12'>
                <p className='text-white'>MENU</p>
            </div>
        </nav>
    )
}

export default Nav