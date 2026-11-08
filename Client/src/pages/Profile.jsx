import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  signOutStart,
  signOutFailure,
  signOutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  //code used to update the profile from frontend

  //wt are the changes we do inside the profile we do in the formdata
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // update user profile  frontend update is getting update and connected to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      setDeleteSuccess(true);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  //signout
  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/auth/signout", { method: "GET" });
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
  // this will handle the listings
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  //handles the delete functionality in my listing 
     const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
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
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer"
        >
          {/* loading interface when we click on the update button */}
          {loading ? "Loading..." : "Update"}
        </button>

        {/* create listing button */}
        <Link
          to={"/create-listing"}
          className="bg-green-700 text-white p-3 uppercase text-center opacity-95 rounded-lg"
        >
          Create Listing
        </Link>
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
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      {/* if the user is not authorized for updating  */}
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      {/* if user updated sucessfully */}
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>
      {/* if account deleted successfully */}
      <p className="text-red-800 mt-5">
        {deleteSuccess ? "User deleted successfully" : ""}
      </p>

      {/* listing which the user created */}
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      {/* error if show listing is not possible */}
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>
      {/* show the listing in the UI */}
      {userListings &&
        userListings.length > 0 &&
       <div className="flex flex-col gap-4"> 
        <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
         {userListings.map((listing) => (
          // this div contains img name delete and edit button inside it 
          <div key={listing._id} 
            className="border rounded-sm p-3 flex gap-3 justify-between items-center"
          >
            {/* images */}
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls?.[0] || "/placeholder.png"}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
                className="h-20 w-20 object-contain"
                alt="listing"
              />
            </Link>
            <Link  className="text-slate-700 font-semibold flex-1 hover:underline truncate" to={`/listing/${listing._id}`}>
                <p>
                  {listing.name}
                </p>
            </Link>
            {/* buutons delete and edit */}
            <div className="flex flex-col items-center">
              <button onClick={()=>handleListingDelete(listing._id)} className="text-red-700 uppercase">Delete</button>
              <button className="text-green-700 uppercase">Edit</button>
            </div>
              
          </div>
        ))}
       </div>}
       
    </div>
  );
}
