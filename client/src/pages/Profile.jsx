import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

function Profile() {
  const fileRef = useRef(null); // Create a reference to the file input element
  const { currentUser } = useSelector((state) => state.user); // Get the current user from the Redux store
  const [file, setFile] = useState(undefined); // Create a state variable to store the file
  const [filePerc, setFilePerc] = useState(0); // Create a state variable to store the file upload percentage
  const [fileUploadError, setFileUploadError] = useState(false); // Create a state variable to store the file upload error
  const [formData, setFormData] = useState({}); // Create a state variable to store the form data
  console.log(formData);

  //! Firebase Storage Google rules
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 && request.resource.contentType.matches('image/.*')
  //   }

  // Use the useEffect hook to upload the file to Firebase Storage when the file state changes
  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file]);

  // Create a function to handle the file upload

  const handleFileUpload = async () => {
    const storage = getStorage(app); // Get the Firebase Storage instance from the app
    const fileName = new Date().getTime() + file.name; // Create a unique file name  by appending the current timestamp to the file name
    const storageRef = ref(storage, fileName); // Create a reference to the file in Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file); // Create an upload task to upload the file to Firebase Storage

    // Add event listeners to the upload task to track the upload progress and handle errors

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      }, // Track the upload progress and update the filePerc state variable
      (error) => {
        setFileUploadError(true);
      }, // Handle any errors that occur during the upload process and update the fileUploadError state variable to true if an error occurs
      () => {
        // When the upload is complete, get the download URL of the file and update the avatar field in the form data state variable
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/.*"
          onChange={(e) => setFile(e.target.files[0])} // Update the file state variable with the selected file when the file input changes
        />
        <img
          onClick={() => fileRef.current.click()} // Trigger the file input click event when the image is clicked
          src={formData.avatar || currentUser.avatar} // Display the uploaded avatar or the current user's avatar
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        {/* Display the file upload status based on the filePerc and fileUploadError state variables */}
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              {" "}
              Error Image Upload(Image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700"> {`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700"> Image Successfully Uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="text"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer"> Delete account</span>
        <span className="text-red-700 cursor-pointer"> Sign out</span>
      </div>
    </div>
  );
}

export default Profile;
