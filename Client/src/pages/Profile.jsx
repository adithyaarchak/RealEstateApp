import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, updateUserStart, updateUserSuccess, updateUserFailure, signOutStart,signOutFailure,signOutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";


export default function Profile() {
  const { currentUser, loading,error} = useSelector((state) => state.user);
  const [formData,setFormData] = useState({});
  const dispatch = useDispatch(); 
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  
  //code used to update the profile from frontend

  //wt are the changes we do inside the profile we do in the formdata
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  // update user profile  frontend update is getting update and connected to backend
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    dispatch(updateUserStart());
    const res = await fetch(`/api/user/update/${currentUser._id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success === false) {
      dispatch(updateUserFailure(data.message));
      return;
    }
    dispatch(updateUserSuccess(data));

    // when user update is successfull
    setUpdateSuccess(true);
  } catch (error) {
    console.log(error);
    dispatch(updateUserFailure(error.message));

  }
};

// delete user from the front-end
const handleDeleteUser = async () => {
  try {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`,{
      method: 'DELETE',
    });
    const data = await res.json();
    if(data.success === false) {
      dispatch(deleteUserFailure(data.message));
      return;
    }
    dispatch(deleteUserSuccess(data));
    setDeleteSuccess(true)
  } catch (error) {
    dispatch(deleteUserFailure(error.message));
  }
}
//signout in 
const handleSignOut = async () => {
  try {
    dispatch(signOutStart());
    const res = await fetch('/api/auth/signout', { method: 'GET' });
    const data = await res.json();
    if (data.success === false) {
      dispatch(signOutFailure(data.message));
      return;
    }
    dispatch(signOutSuccess(data));
  } catch (error) {
    dispatch(signOutFailure(error.message));
  }
};
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* profile */}
        <img
          // onClick={() => fileRef.current.click()} //file upload by clicking the profile
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        {/* form inputs */}
        <input
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button 
          disabled={loading} //so when it is loading th ebutton will get disablled
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer">
          {/* loading interface when we click on the update button */}
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      {/* delete  button */}
      <div className="flex justify-between mt-5">
        <span 
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteUser}
        >
          Delete account
        </span>


      {/* sign out button */}
      <span 
        onClick={handleSignOut}
        className="text-red-700 cursor-pointer"
      >
        Sign out
      </span>


      </div>
      {/* if the user is not authorized for updating  */}
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      {/* if user updated sucessfully */}
      <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated successfully!' : ''}</p>
      {/* if account deleted successfully */}
      <p className="text-red-800 mt-5">{deleteSuccess ? 'User deleted successfully' : ''}</p>
    </div>
  );
}
