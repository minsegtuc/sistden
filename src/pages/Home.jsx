import { useState } from 'react'
import Nav from '../components/Nav'
import Aside from '../components/Aside'
import Inicio from './Inicio'
import { Outlet } from 'react-router-dom'

const Home = () => {

    const [open, setOpen] = useState(false)

    const handleToggle = () => {
        setOpen(!open)
    }

    return (
        <div className='h-full w-full'>
            <Nav handleToggle={handleToggle} />
            <div className='flex flex-row w-full'>
                <Aside open={open}/>
                <div className={`${open ? 'w-5/6' : 'w-full'} transition-all duration-300 delay-100`}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Home