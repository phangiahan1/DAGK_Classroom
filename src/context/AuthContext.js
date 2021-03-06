import { createContext, useReducer, useEffect } from 'react'
import { authReducer } from "../reducers/authReducer"
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from "./constants"
import axios from "axios"
import setAuthToken from '../utils/setAuthToken'

export const AuthContext = createContext()

const AuthContextProvider = ({ children }) => {
    const [authState, dispatch] = useReducer(authReducer, {
        authLoading: true,
        isAuthenticated: false,
        user: null,
        isAdmin: false
    })

    // Authenticate user
    const loadUser = async () => {
        if (localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
            setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME])
        }

        try {
            const response = await axios.get(`${apiUrl}/user/auth`)
            console.log(response)
            if (response.data.success) {
                dispatch({
                    type: 'SET_AUTH',
                    payload: { isAuthenticated: true, user: response.data.user, isAdmin: response.data.isAdmin }
                })
            }
        } catch (error) {
            console.log("error")
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
            setAuthToken(null)
            dispatch({
                type: 'SET_AUTH',
                payload: { isAuthenticated: false, user: null,isAdmin: false }
            })
        }
    }

    useEffect(() => loadUser(), [])

    //Login 
    const loginUser = async userForm => {
        try {
            const response = await axios.post(`${apiUrl}/user/login`, userForm)
            if (response.data.success) {
                localStorage.setItem(
                    LOCAL_STORAGE_TOKEN_NAME,
                    response.data.token
                )
            }

            await loadUser()
            
            console.log(authState)
            return response.data
        } catch (error) {
            if (error.response.data) return error.response.data
            else return {
                success: false, message: error.message
            }
        }
    }

    //Login google
    const loginUserGG = async userForm => {
        try {
            const response = await axios.post(`${apiUrl}/user/loginGoogle`, userForm)
            if (response.data.success) {
                localStorage.setItem(
                    LOCAL_STORAGE_TOKEN_NAME,
                    response.data.token
                )
            }

            await loadUser()

            return response.data
        } catch (error) {
            if (error.response.data) return error.response.data
            else return {
                success: false, message: error.message
            }
        }
    }

    // Register
	const registerUser = async userForm => {
		try {
			const response = await axios.post(`${apiUrl}/user`, userForm)
			if (response.data.success)
				localStorage.setItem(
					LOCAL_STORAGE_TOKEN_NAME,
					response.data.token
				)

			await loadUser()

			return response.data
		} catch (error) {
			if (error.response.data) return error.response.data
			else return { success: false, message: error.message }
		}
	}

	// Logout
	const logoutUser = () => {
		localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
		dispatch({
			type: 'SET_AUTH',
			payload: { isAuthenticated: false, user: null, isAdmin:false }
		})
	}

    // Context data
    const authContextData = { loginUser, loginUserGG, registerUser, logoutUser, authState }

    // Return provider
    return (
        <AuthContext.Provider value={authContextData}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider
