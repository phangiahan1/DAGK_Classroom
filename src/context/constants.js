export const apiUrl =
	process.env.NODE_ENV !== 'production'
		? 'http://localhost:5000'
		: 'https://btn2-web-grades.herokuapp.com'

export const LOCAL_STORAGE_TOKEN_NAME = 'tokenData'
