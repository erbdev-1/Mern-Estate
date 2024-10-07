// import { useState } from "react";
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from "firebase/storage";
// import { app } from "../firebase";

// function CreateListing() {
//   const [files, setFiles] = useState([]); // Create a state variable to store the files

//   const [formData, setFormData] = useState({
//     imageUrls: [], // Create a state variable to store the image URLs
//     videoUrls: [], // Create a state variable to store the video URLss
//   }); // Create a state variable to store the form data
//   const [imageUploadError, setImageUploadError] = useState(false); // Create a state variable to store the image upload error

//   const [upLoading, setUpLoading] = useState(false); // Create a state variable to store the upload status

//   console.log(formData);

//   //! Create a function to handle the image submission  and store the images in Firebase Storage and return the download URL of each image to update the imageUrls in the form data state variable when the upload is complete
//   const handleImageSubmit = (e) => {
//     // Create a function to handle the image submission and store the images in Firebase Storage and return the download URL of each image to update the imageUrls in the form data state variable when the upload is complete
//     if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
//       setUpLoading(true); // Set the upLoading state variable to true
//       setImageUploadError(false); // Set the imageUploadError state variable to false
//       const promises = []; // Create an empty array to store the promises

//       // Loop through the files array and create a promise for each file
//       for (let i = 0; i < files.length; i++) {
//         promises.push(storeImage(files[i])); // Push the promise to the promises array
//       }
//       Promise.all(promises) // Use the Promise.all() method to wait for all promises to resolve
//         .then((urls) => {
//           // When all promises are resolved, update the imageUrls in the form data state variable with the download URLs of the images and reset the files state variable to an empty array to clear the file input field after the upload is complete
//           setFormData({
//             ...formData,
//             imageUrls: formData.imageUrls.concat(urls),
//           });
//           setImageUploadError(false); // Set the imageUploadError state variable to false
//           setUpLoading(false); // Set the upLoading state variable to false
//         })
//         .catch((err) => {
//           setImageUploadError("Image upload failed (2 mb max per image ) ");
//           setUpLoading(false);
//         });
//     } else {
//       setImageUploadError("Max 6 images allowed");
//       setUpLoading(false);
//     }
//   };

//   // Create a function to store the image in Firebase Storage and return the download URL
//   const storeImage = (file) => {
//     return new Promise((resolve, reject) => {
//       // Create a new promise that takes a resolve and reject function as arguments
//       const storage = getStorage(app); // Get the Firebase Storage instance from the app
//       const fileName = new Date().getTime() + file.name; // Create a unique file name by appending the current timestamp to the file name
//       const storageRef = ref(storage, fileName); // Create a reference to the file in Firebase Storage and pass the file name
//       const uploadTask = uploadBytesResumable(storageRef, file); // Create an upload task to upload the file to Firebase Storage
//       // Add event listeners to the upload task to track the upload progress and handle errors
//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           // Track the upload progress
//           const progress =
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Calculate the upload progress as a percentage
//           console.log("Upload is " + progress + "% done"); // Log the upload progress to the console
//         },
//         (error) => {
//           reject(error); // Call the reject function if there is an error
//         },
//         () => {
//           // When the upload is complete, get the download URL of the file and call the resolve function with the download URL
//           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//             resolve(downloadURL); // Call the resolve function with the download URL if the upload is successful
//           });
//         }
//       );
//     });
//   };

//   //! Create a function to handle the removal of an image from the imageUrls array in the form data state variable

//   const handleRemoveImage = (index) => () => {
//     setFormData({
//       ...formData,
//       imageUrls: formData.imageUrls.filter((_, i) => i !== index), // Filter out the image at the specified index
//     });
//   };

//   return (
//     <main className="p-3 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-semibold text-center my-7 ">
//         Create a Listing
//       </h1>
//       <form className="flex flex-col sm:flex-row gap-4">
//         <div className="flex flex-col gap-4 flex-1">
//           <input
//             type="text"
//             placeholder="Name"
//             className="border p-3 rounded-lg "
//             id="name"
//             maxLength="62"
//             minLength="10"
//             required
//           />
//           <textarea
//             type="text"
//             placeholder="Description"
//             className="border p-3 rounded-lg "
//             id="description"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Address"
//             className="border p-3 rounded-lg "
//             id=" address"
//             required
//           />
//           <div className="flex gap-6 flex-wrap">
//             <div className="flex gap-2">
//               <input type="checkbox" id="sale" className="w-5" />
//               <span>Sell</span>
//             </div>
//             <div className="flex gap-2">
//               <input type="checkbox" id="rent" className="w-5" />
//               <span>Rent</span>
//             </div>
//             <div className="flex gap-2">
//               <input type="checkbox" id="parking" className="w-5" />
//               <span>Parking spot</span>
//             </div>
//             <div className="flex gap-2">
//               <input type="checkbox" id="furnished" className="w-5" />
//               <span>Furnished</span>
//             </div>
//             <div className="flex gap-2">
//               <input type="checkbox" id="offer" className="w-5" />
//               <span>Offer</span>
//             </div>
//           </div>
//           <div className="flex flex-wrap gap-6">
//             <div className="flex items-center gap-2">
//               <input
//                 type="number"
//                 id="bedrooms"
//                 min="1"
//                 max="10"
//                 required
//                 className="p-3 border border-gray-300 rounded-lg"
//               />
//               <p>Beds</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <input
//                 type="number"
//                 id="bathrooms"
//                 min="1"
//                 max="10"
//                 required
//                 className="p-3 border border-gray-300 rounded-lg"
//               />
//               <p>Baths</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <input
//                 type="number"
//                 id="regularPrice"
//                 min="1"
//                 max="10"
//                 required
//                 className="p-3 border border-gray-300 rounded-lg"
//               />
//               <div className="flex flex-col items-center">
//                 <p>Regular price</p>
//                 <span className="text-xs">(£ / Month)</span>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <input
//                 type="number"
//                 id="discountPrice"
//                 min="1"
//                 max="10"
//                 required
//                 className="p-3 border border-gray-300 rounded-lg"
//               />
//               <div className="flex flex-col items-center">
//                 <p>Discounted price</p>
//                 <span className="text-xs ">(£ / Month)</span>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-col flex-1 gap-4">
//           <p className="font-semibold">
//             Images:
//             <span className="font-normal text-gray-600 ml-2">
//               The first image will be the cover (max 6)
//             </span>
//           </p>
//           <div className="flex gap-4">
//             <input
//               onChange={(e) => setFiles(e.target.files)}
//               className="p-3 border border-gray-300 rounded w-full"
//               type="file"
//               id="images"
//               accept="image/*"
//               multiple
//             />
//             <button
//               type="button"
//               disabled={upLoading}
//               onClick={handleImageSubmit}
//               className="p-3 text-green-700  border border-green-700 rounded  uppercase hover:shadow-lg  disabled:opacity-80 "
//             >
//               {upLoading ? "Uploading..." : "Upload"}
//             </button>
//           </div>
//           <p className="text-red-700 ">
//             {imageUploadError && imageUploadError}{" "}
//           </p>
//           {
//             // Display the uploaded images
//             formData.imageUrls.length > 0 &&
//               formData.imageUrls.map((url, index) => (
//                 <div
//                   key={url}
//                   className="flex justify-between p-3 border items-center"
//                 >
//                   <img
//                     src={url}
//                     alt="listing image"
//                     className="w-20 h-20 object-cover rounded-lg"
//                   />
//                   <button
//                     onClick={handleRemoveImage(index)}
//                     type="button"
//                     className="p-3 text-red-700 rounded-l uppercase hover:opacity-75"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               ))
//           }
//           <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
//             Create Listing
//           </button>
//         </div>
//       </form>
//     </main>
//   );
// }

// export default CreateListing;

import { useState } from "react";
import ImageUploader from "../components/ListingUploaders.jsx/ImageUploader";
import VideoUploader from "../components/ListingUploaders.jsx/VideoUploader";

function CreateListing() {
  const [formData, setFormData] = useState({
    imageUrls: [],
    videoUrls: [],
  });

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg "
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg "
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg "
            id=" address"
            required
          />
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
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">(£ / Month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="1"
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs ">(£ / Month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          {/* ImageUploader Bileşenini Burada Kullanın */}
          <ImageUploader />
          <p className="font-semibold">
            Videos:
            <span className="font-normal text-gray-600 ml-2">
              The first video will be the cover (max 3)
            </span>
          </p>
          {/* VideoUploader Bileşenini Burada Kullanın */}
          <VideoUploader />

          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
