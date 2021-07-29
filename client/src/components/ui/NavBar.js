import React from 'react'
import { NavLink } from 'react-router-dom'

export const NavBar = () => {
    return (
        <nav className='row wrap'>
          <li className='row wrap'>
          <div className='row input'>
            <img  className='cardImg logo' src='https://svgsilh.com/svg/307294.svg' alt='logo'/>
            <span>--</span>Country App
          </div>
            <ul>
              <NavLink  className='btn' to="/principal" activeClassName='active'>Principal</NavLink>
            </ul>
            <ul>
              <NavLink  className='btn' to="/actividad" activeClassName='active'>Actividad</NavLink>
            </ul>
            <ul>
              <NavLink  className='btn' to="/about" activeClassName='active'>About</NavLink>
            </ul>
          </li>
        </nav>
    )
}
