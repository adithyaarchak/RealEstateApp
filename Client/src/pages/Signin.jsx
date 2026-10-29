import { Link, useNavigate } from "react-router-dom";
import { useState,} from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInStart,signInSuccess,signInFailure } from "../redux/user/userSlice";


export default function Signup() {
  const [formData, setFormData] = useState({});

  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false); instead use redux
  const {loading, error }= useSelector((state) => state.user);


  const navigate = useNavigate();
  // react-redux initialize
  const dispatch = useDispatch();

  // user enters in the UI using this
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  //when we click signin
  const handleSubmit = async (e) => {
    //prevent refreshing the page
    e.preventDefault();

    try {
      // setLoading(true); instead
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // if user already have a account and
      // try to create account with the same cerdentical this block of code will throw the error
      if (data.success === false) {
        // setError(data.message);
        // setLoading(false); instead using redux
        dispatch(signInFailure(data.message));
        return;
      }
      // setLoading(false);
      // console.log(data); instead of this use redux 
      dispatch(signInSuccess(data));


      //if everything is fine no need to displayy the error on screnn     
      // setError(null);
      
      // navigates to home once u signin in
      navigate('/');
    } catch (error) {
      // setLoading(false);
      // setError(error.message); instead use redux
      dispatch(signInFailure(error.message));
    }
  };

  // console.log(formData);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          type="email"
          placeholder="email"
          className="border rounded-lg p-3"
          id="email"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="password"
          className="border rounded-lg p-3"
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>

      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>

      {error && <p className="text-red-500 mt-5">{error}</p>}
      
    </div>
  );
}
