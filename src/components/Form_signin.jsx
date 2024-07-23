import React from 'react'

const Form_signin = ({setEmail, setPassword}) => {

  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  const handleChangePassword = (e) => {
    setPassword(e.target.value)
  }

  return (
    <div>
        <form action="" className='flex flex-col gap-6'>
            <input className='w-72 p-3 rounded border-[#757873] border-2' type="email" placeholder='Email' onChange={handleChangeEmail}/>
            <input className='w-72 p-3 rounded border-[#757873] border-2' type="password" placeholder='Contraseña' onChange={handleChangePassword}/>
        </form>
    </div>
  )
}

export default Form_signin