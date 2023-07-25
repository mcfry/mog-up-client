import React, { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'

import { AuthContext } from '../utils/Auth.js'

const PrivateRoute = () => {
	const { currentUser } = useContext(AuthContext)

	if (!currentUser) {
		return (
			<Navigate to="/login" replace={true} />
		)
	}
	
	return (
		<Outlet />
	)
}

export default PrivateRoute