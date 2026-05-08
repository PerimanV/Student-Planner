import { useState } from 'react'

function App() {
  

  return (
    <div className='bg-gray-950 min-h-screen text-white'>
      <header className='p-4 space-y-2 justify-between flex'>
        <nav className='justify-between'>
          <ul className='flex gap-x-4 gap-y-1 tracking-wider'>
              <li className='hover:text-emerald-900 transition-colors'><a href="">Home</a></li>
              <li className='hover:text-emerald-900 transition-colors'><a href="">Courses</a></li>
              <li className='hover:text-emerald-900 transition-colors'><a href="">Calendar</a></li>
              <li className='hover:text-emerald-900 transition-colors'><a href="">Tasks</a></li>
              <li className='hover:text-emerald-900 transition-colors'><a href="">Notes</a></li>
              <li className='hover:text-emerald-900 transition-colors'><a href="">Profile</a></li>
          </ul>
        </nav>
          <div className='flex gap-2'>
              <span className='text-lg'> User </span> <img className='w-8' src='/src/assets/react.svg'></img>
          </div>
      </header>

      <h1 className='font-bold text-center text-6xl'>Dashboard</h1>

      <section className='max-w-3xl mx-auto grid gap-5 px-5 py-12 grid-cols-autofit'>

          <div className='card'>
              <h3 className='text-lg'>Card</h3>
              <p>This is a card</p>
          </div>
          <div className='card'>
              <h3>Card</h3>
              <p>This is a card</p>
          </div>
          <div className='card'>
              <h3>Card</h3>
              <p>This is a card</p>
          </div>

      </section>
      

    </div>
  )
}

export default App
