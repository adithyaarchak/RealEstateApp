import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"

// if user try to go to the profile 
//  page it will take it to signin page only if the the user is exist can access profile page
export default function PrivateRoute() {
    const {currentUser} = useSelector((state)=>state.user)
  return currentUser ? <Outlet /> : <Navigate to = 'sign-in' />
}
