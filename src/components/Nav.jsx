import {useState} from 'react'
import Aside from './Aside'
import { BsList, BsPersonCircle, BsBoxArrowRight, BsChevronLeft } from "react-icons/bs";


const Nav = () => {

    //LO QUE SIGUE PARA EL CONTEXT 
    const [open, setOpen] = useState(false)

    const handleAside = (state) => {
        if(state === 'open'){
            setOpen(true)
        }else{
            setOpen(false)
        }
    }

    return (
        <nav className='bg-[#345071] h-20 w-full flex flex-row justify-between items-center'>
            <div className='flex flex-row gap-2 items-center pl-12 justify-center'>
                {
                    open ? (<BsChevronLeft className='text-white text-3xl' onClick={() => handleAside('close')}/>) : (<BsList className='text-white text-3xl' onClick={() => handleAside('open')}/>)
                }                
                <img src="/img_logo.png" alt="" className='w-52'/>
            </div>
            <div className='pr-12 flex flex-row gap-4 justify-center items-center'>
                <BsPersonCircle className='text-4xl text-white'/>
                <div className='flex flex-col'>
                    <p className='text-white text-sm font-bold'>Nombre usuario</p>
                    <p className='text-white text-sm'>Rol: rol usuario</p>
                </div>
                <BsBoxArrowRight className='text-2xl text-white'/>
            </div>
        </nav>
    )
}

export default Nav