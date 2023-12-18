import React from 'react'
import './Home.css'
import Logo from '../img/Yugi.svg'
export default function Home() {
  return (
    <div>      
      <header className="header">
        <img src={Logo} alt="Logo" className="logo" />
        <input type="text" className="search-bar" placeholder="Search..." />
      </header>
    </div>
  )
}