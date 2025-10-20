import { useState, useContext } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { BsHouse, BsFolderPlus, BsBoxArrowRight, BsListUl, BsPinMapFill, BsMap, BsBarChartLine, BsShieldLock, BsPerson, BsPersonCircle } from "react-icons/bs";
import { MdOutlineArrowDropDown, MdOutlineArrowRight, MdChecklistRtl } from "react-icons/md";
import { MdOutlineViewModule } from "react-icons/md";
import { TbLogs, TbCategory2 } from "react-icons/tb";
import { ContextConfig } from '../context/ContextConfig'
import { motion, AnimatePresence } from "framer-motion"

const Admin = () => {
    return (
        <div className='h-full w-full flex flex-col md:flex-row'>
            <div className='md:min-w-[10%] md:max-w-[10%] w-full h-screen bg-[#005CA2]'>
                <div className='min-h-[10%] px-4 justify-center items-center hidden md:flex'>
                    <img src="/logo_admin_v2_blanco.png" alt="" className='' />
                </div>
                <nav className='min-h-[90%]'>
                    <ul className='flex md:flex-col md:justify-start md:items-start'>
                        <li className='w-full'>
                            <NavLink to={'/admin/usuarios'} className='flex flex-col items-center md:flex-row md:items-start text-white hover:bg-white/10 transition-all duration-200 ease-in-out w-full p-4'>
                                <BsPerson className='w-5 h-5 text-white' />
                                <p className='md:pl-2 pl-0 text-md text-white'>Usuarios</p>
                            </NavLink>
                        </li>
                        <li className='w-full'>
                            <NavLink to={'/admin/rol'} className='flex flex-col items-center md:flex-row md:items-start text-white hover:bg-white/10 transition-all duration-200 ease-in-out w-full p-4'>
                                <TbCategory2 className='w-5 h-5 text-white' />
                                <p className='md:pl-2 pl-0 text-md text-white'>Roles</p>
                            </NavLink>
                        </li>
                        <li className='w-full'>
                            <NavLink to={'/admin/logs'} className='flex flex-col items-center md:flex-row md:items-start text-white hover:bg-white/10 transition-all duration-200 ease-in-out w-full p-4'>
                                <TbLogs className='w-5 h-5 text-white' />
                                <p className='md:pl-2 pl-0 text-md text-white'>Logs</p>
                            </NavLink>
                        </li>
                        <li className='w-full'>
                            <NavLink to={'/modulos'} className='flex flex-col items-center md:flex-row md:items-start text-white hover:bg-white/10 transition-all duration-200 ease-in-out w-full p-4'>
                                <MdOutlineViewModule className='w-5 h-5 text-white' />
                                <p className='md:pl-2 pl-0 text-md text-white'>Módulos</p>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className='md:w-[90%] w-full'>
                <div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Admin