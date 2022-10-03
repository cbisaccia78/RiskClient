import './Root.css'
import React, {useContext} from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import AuthContext from '../../store/auth-context'
import RegisterForm from '../UI/RegisterForm'
import LoginForm from '../UI/LoginForm'

export default function(){
    const authctx = useContext(AuthContext)
    return (
        <div>
            <Navbar />
            <Outlet />
            <RegisterForm/>
            <LoginForm/>
            <Footer />
        </div>
    )
}
