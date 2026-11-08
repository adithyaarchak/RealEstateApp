import { userRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  // console.log(formData);
  // This function runs when the user clicks the upload button.
  //  It checks the images, uploads them all, and saves the URLs.
  const handleImageSubmit = async (e) => {
    /*
    Check the rules.
    If no image is selected, show an alert and stop.
    If the selected images plus already-uploaded ones are more than 6, show an alert and stop.
    */
    if (files.length === 0) return alert("Select at least one image");
    if (files.length + imageUrls.length > 6) return alert("Max 6 images");

    // Upload all images together. Array.from(files)
    //  turns the selected files into a list. .map(uploadToImageKit) starts an upload for each one (using the function we just went through).
    //  Promise.all waits until every upload finishes and gives back a list of URLs.
    try {
      setUploading(true); //starts loading
      const urls = await Promise.all(Array.from(files).map(uploadToImageKit));
      setImageUrls((prev) => prev.concat(urls)); //Save the URLs. setImageUrls adds the new URLs to the ones you already have, so earlier uploads aren’t lost.
      console.log("Uploaded:", urls);
      setFormData((prev) => ({
        ...prev,
        imageUrls: prev.imageUrls.concat(urls),
      }));
    } catch (err) {
      //Handle errors. If any upload fails, the catch block logs the error and shows an alert with the message.
      console.error(err);
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };
  // This function uploads one image to ImageKit and gives you back its URL.
  const uploadToImageKit = async (file) => {
    // fresh signature for every file (tokens are single-use)
    const auth = await fetch("/api/upload/imagekit-auth").then((r) => r.json());

    // This builds the package of data that gets sent to ImageKit.
    /*
    file: the actual image
    fileName: the image’s original name (e.g. house.jpg)
    publicKey: your ImageKit public key, which tells ImageKit which account this is for
    signature, expire, token: the temporary pass from your server, proving the upload is allowed
    folder: where to store it in ImageKit (/listings)
     */
    const formData = new FormData();
    console.log("publicKey:", import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("publicKey", import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
    formData.append("signature", auth.signature);
    formData.append("expire", auth.expire);
    formData.append("token", auth.token);
    formData.append("folder", "/listings");

    const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");
    return data.url;
  };

  // handles the remove image functionality
  const handleRemoveImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  // complete create listing page functionality
  const handleChange = (e) => {
    // either chose sale or rent
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    // condtion for parkign spot furnished and offer
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    //condition for name discription and address
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  // submit the form to the data base
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      // after clicking to create listing it will navigate to particular id page
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-30 justify-center"
      >
        {/* left side */}
        <div className="flex flex-col gap-4 w-full sm:w-md">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          {/* checkboxes */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          {/* inputs of requirements */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="100000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <span className="text-xs">($ / Month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* right side */}
        <div className="flex flex-col gap-4 w-full sm:w-md">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            {/* upload file */}
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 
              bg-gray-400 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {/* uploaded file will be displayed here */}
          {imageUrls.map((url, index) => (
            <div
              key={url}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <img
                src={url}
                alt="listing"
                className="w-20 h-20 object-cover rounded-lg"
              />
              {/* delete the uploaded images */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="text-red-700 uppercase hover:opacity-75"
              >
                Delete
              </button>
            </div>
          ))}
          {/* button */}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating" : "Create Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
