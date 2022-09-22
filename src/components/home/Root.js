import './Root.css'
import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

export default function(){
    return (
        <div>
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    )
}
