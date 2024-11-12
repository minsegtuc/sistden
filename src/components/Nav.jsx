import { useState } from 'react'
import { BsList, BsChevronLeft } from "react-icons/bs";
import { NavLink } from 'react-router-dom';

const Nav = ({ handleToggle }) => {

    const [open, setOpen] = useState(false)

    const handleAside = (state) => {
        if (state === 'open') {
            setOpen(true)
            handleToggle()
        } else {
            setOpen(false)
            handleToggle()
        }
    }    

    return (
        <nav className='bg-[#005CA2] h-20 w-full flex flex-row justify-between items-center text-sm'>
            <div className='flex flex-row gap-2 items-center pl-12 justify-center'>
                {
                    open ? (<BsChevronLeft className='text-white text-3xl' onClick={() => handleAside('close')} />) : (<BsList className='text-white text-3xl' onClick={() => handleAside('open')} />)
                }
                <NavLink to='/sgd' className='text-white text-2xl font-bold'>
                    <img src="/sgd/img_logo.png" alt="" className='lg:flex w-52' />
                </NavLink>
            </div>
        </nav>
    )
}

export default Nav