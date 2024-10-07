import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";

function ImageUploader() {
  const [files, setFiles] = useState([]); // Seçilen dosyaları saklamak için state
  const [imageUrls, setImageUrls] = useState([]); // Yüklenen resim URL'lerini saklamak için state
  const [upLoading, setUpLoading] = useState(false); // Yükleme durumu
  const [imageUploadError, setImageUploadError] = useState(false); // Yükleme hatası mesajı

  // Resim yükleme işlemini gerçekleştiren fonksiyon
  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + imageUrls.length < 7) {
      setUpLoading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setImageUrls([...imageUrls, ...urls]); // Yüklenen resim URL'lerini state'e ekle
          setImageUploadError(false);
          setUpLoading(false);
        })
        .catch(() => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUpLoading(false);
        });
    } else {
      setImageUploadError("Max 6 images allowed");
      setUpLoading(false);
    }
  };

  // Resmi Firebase Storage'a yükleyen fonksiyon
  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // Belirli bir resmi silen fonksiyon
  const handleRemoveImage = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index)); // Belirli indexteki resmi kaldır
  };

  return (
    <div>
      <div className="flex gap-4">
        <input
          onChange={(e) => setFiles(e.target.files)}
          className="p-3 border border-gray-300 rounded w-full"
          type="file"
          id="images"
          accept="image/*"
          multiple
        />
        <button
          type="button"
          disabled={upLoading}
          onClick={handleImageSubmit}
          className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
        >
          {upLoading ? "Uploading..." : "Upload"}
        </button>
      </div>
      <p className="text-red-700">{imageUploadError && imageUploadError}</p>
      {imageUrls.length > 0 &&
        imageUrls.map((url, index) => (
          <div
            key={url}
            className="flex justify-between p-3 border items-center"
          >
            <img
              src={url}
              alt="listing image"
              className="w-20 h-20 object-cover rounded-lg"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              type="button"
              className="p-3 text-red-700 rounded-l uppercase hover:opacity-75"
            >
              Delete
            </button>
          </div>
        ))}
    </div>
  );
}

export default ImageUploader;
