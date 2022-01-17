import Login from './Login/Login.js'
import Register from './Login/Register.js'
import { AuthContext } from './../context/AuthContext'
import { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import ListAccountLocked from '../components/Admin/ListAccountLocked/ListAccountLocked'
import OTPActivation from './OTPActivation/OTPActivation.js'

const Auth = ({ authRoute }) => {
	const {
		authState: { authLoading, isAuthenticated, isAdmin }
	} = useContext(AuthContext)

	let body

	if (authLoading)
		body = (
			<div>Loading...</div>
		)
	else if (isAuthenticated) return <Redirect to='/' />
	else
		body = (
			<>
				{authRoute === 'login' && <Login />}
				{authRoute === 'register' && <Register />}
			</>
		)
	return (
        <div>
		{body}
        </div>
	)
}

export default Auth