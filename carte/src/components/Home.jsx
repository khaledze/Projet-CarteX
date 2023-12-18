import React from 'react'
import './Home.css'
import Logo from '../img/yu.png'

export default function Home() {
    return (
        <div>      
            <header className="header">
                <div className="logo">
                    <img src={Logo} alt="Logo" style={{ width: '100%', height: '100%' }} />
                </div>
                <div className="main">
                    <input required type="text" className="input" />
                    <label>
                        <span style={{transitionDelay: '0ms', left: '0px'}}>U</span>
                        <span style={{transitionDelay: '75ms', left: '20px'}}>s</span>
                        <span style={{transitionDelay: '150ms', left: '33px'}}>e</span>
                        <span style={{transitionDelay: '225ms', left: '47px'}}>r</span>
                        <span style={{transitionDelay: '300ms', left: '56px'}}>n</span>
                        <span style={{transitionDelay: '375ms', left: '72px'}}>a</span>
                        <span style={{transitionDelay: '450ms', left: '85px'}}>m</span>
                        <span style={{transitionDelay: '525ms', left: '110px'}}>e</span>
                        <p style={{position: 'absolute', left: '-8px', top: '-10px', fontSize: '24px', margin: '10px', color: 'gray', transition: '0.5s', pointerEvents: 'none'}}>Username</p>
                    </label>
                </div>
            </header>
        </div>
    )
}