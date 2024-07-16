import React from 'react'

const Form_signin = () => {
  return (
    <div className='bg-yellow-200'>
        <form action="" className='flex flex-col gap-6'>
            <input className='w-72 p-3 rounded border-[#757873] border-2' type="text" placeholder='Email' />
            <input className='w-72 p-3 rounded border-[#757873] border-2' type="text" placeholder='Contraseña' />
        </form>
    </div>
  )
}

export default Form_signin