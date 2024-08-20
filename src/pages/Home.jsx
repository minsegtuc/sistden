import { useEffect, useState, useContext } from 'react'
import Nav from '../components/Nav'
import Aside from '../components/Aside'
import Inicio from './Inicio'
import { Outlet } from 'react-router-dom'
import { ContextConfig } from '../context/ContextConfig'

const Home = () => {

    const [open, setOpen] = useState(false)
    const { handleLogin, login } = useContext(ContextConfig)

    const handleToggle = () => {
        setOpen(!open)
    }

    return (
        <div className='h-full w-full'>
            <Nav handleToggle={handleToggle} />
            <div className='flex lg:flex-row flex-col lg:w-full'>
                <Aside open={open}/>
                <div className={`${open ? 'lg:w-5/6' : 'lg:w-full'} transition-all duration-300 delay-100`}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Home