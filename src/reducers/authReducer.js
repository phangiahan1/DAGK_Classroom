export const authReducer = (state, action) => {
	const {
		type,
		payload: { isAuthenticated, user, isAdmin }
	} = action

	switch (type) {
		case 'SET_AUTH':
			return {
				...state,
				authLoading: false,
				isAuthenticated,
				user,
				isAdmin
			}
		default:
			return state
	}
}