import {BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import SignUp from './pages/Signup'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './Components/Header'
import PrivateRoute from './Components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
const App = () => {
  return (
    <BrowserRouter> 
    {/* so that the header will be in all the pages */}
    <Header />
    <Routes>
      <Route path= "/" element = {<Home />}></Route>
      <Route path= "/sign-in" element = {<Signin />}></Route>
      <Route path= "/sign-up" element = {<SignUp />}></Route>
      <Route path= "/about" element= {<About />}></Route>
      <Route path="/listing/:listingId" element = {<Listing/>}></Route>
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/create-listing" element={<CreateListing/>}></Route>
        <Route path="/update-listing/:listingId" element={<UpdateListing/>}></Route>
      </Route>
      
    </Routes>
    </BrowserRouter>
  )
}

export default App
