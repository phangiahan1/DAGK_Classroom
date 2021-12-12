import { Route, Redirect } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Header } from '..'

const ProtectedRoute = ({ children, ...rest }) => {
	//const ProtectedRoute = ({ component: Component, ...rest }) => {
	const {
		authState: { authLoading, isAuthenticated, user }
	} = useContext(AuthContext)

	console.log(authLoading)
	console.log(isAuthenticated)
	// console.log(user[0].username)
	if (user) {
		console.log(user[0].email)
	}

	if (authLoading)
		return (
			<div>
				Wait...
			</div>
		)

	return (
		<Route
			{...rest}
			render={({ location }) => {
				if (isAuthenticated) {
					return children;
				}
				if (!isAuthenticated) {
					return (
						<Redirect
							to={{
								pathname: "/login",
								state: { from: location },
							}}
						/>
					);
				}
				return null;
			}}
		/>
	)
}

export default ProtectedRoute