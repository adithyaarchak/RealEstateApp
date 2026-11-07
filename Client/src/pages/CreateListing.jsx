import { useState } from "react";
export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
  })
  // This function runs when the user clicks the upload button.
  //  It checks the images, uploads them all, and saves the URLs.
  const handleImageSubmit = async (e) => {
    // Stop the page from refreshing. e.preventDefault()
    // prevents the browser’s default form behavior, which would reload the page.
    e.preventDefault();

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
      setLoading(true); //starts loading
      const urls = await Promise.all(Array.from(files).map(uploadToImageKit));
      setImageUrls((prev) => prev.concat(urls)); //Save the URLs. setImageUrls adds the new URLs to the ones you already have, so earlier uploads aren’t lost.
      console.log("Uploaded:", urls);
    } catch (err) {
      //Handle errors. If any upload fails, the catch block logs the error and shows an alert with the message.
      console.error(err);
      alert(err.message);
    }finally {
  setLoading(false);
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

  return (
    <main className="p-3 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-30 justify-center">
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
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />

          {/* checkboxes */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
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
              />
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>
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
              disabled={loading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {loading ? 'Loading...' : 'Upload'}
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
              <button
                type="button"
                onClick={() =>
                  setImageUrls((prev) => prev.filter((_, i) => i !== index))
                }
                className="text-red-700 uppercase hover:opacity-75"
              >
                Delete
              </button>
            </div>
          ))}
          {/* button */}
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create listing
          </button>
        </div>
      </form>
    </main>
  );
}
