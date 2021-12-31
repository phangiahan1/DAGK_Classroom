import { Route, Redirect } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const ProtectedRoute = ({ children, ...rest }) => {
	//const ProtectedRoute = ({ component: Component, ...rest }) => {
	const {
		authState: { authLoading, isAuthenticated, user, isAdmin }
	} = useContext(AuthContext)

	// console.log(authLoading)
	// console.log(isAuthenticated)
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
				if(isAdmin){
					// return (
					// 	<div>
					// 		<HeaderAdmin/>
					// 		<ListAccountLocked/>
					// 	</div>
						
					// );
					return children;
				}
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