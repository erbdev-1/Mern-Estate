import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";

function VideoUploader() {
  const [videoFiles, setVideoFiles] = useState([]); // Seçilen video dosyalarını saklamak için state
  const [videoUrls, setVideoUrls] = useState([]); // Yüklenen video URL'lerini saklamak için state
  const [upLoading, setUpLoading] = useState(false); // Yükleme durumu
  const [videoUploadError, setVideoUploadError] = useState(false); // Yükleme hatası mesajı

  const handleVideoSubmit = () => {
    if (videoFiles.length > 0 && videoFiles.length + videoUrls.length < 4) {
      setUpLoading(true);
      setVideoUploadError(false);
      const promises = [];

      for (let i = 0; i < videoFiles.length; i++) {
        promises.push(storeVideo(videoFiles[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setVideoUrls([...videoUrls, ...urls]); // Yüklenen video URL'lerini state'e ekle
          setVideoUploadError(false);
          setUpLoading(false);
        })
        .catch(() => {
          setVideoUploadError("Video upload failed (max size 10 MB).");
          setUpLoading(false);
        });
    } else {
      setVideoUploadError("Maximum 3 videos allowed.");
      setUpLoading(false);
    }
  };
  console.log(videoFiles);

  const storeVideo = (file) => {
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

  const handleRemoveVideo = (index) => {
    setVideoUrls(videoUrls.filter((_, i) => i !== index)); // Belirli indexteki videoyu kaldır
  };

  return (
    <div>
      <div className="flex gap-4">
        <input
          onChange={(e) => setVideoFiles(e.target.files)}
          className="p-3 border border-gray-300 rounded w-full"
          type="file"
          id="videos"
          accept="video/*"
          multiple
        />
        <button
          type="button"
          disabled={upLoading}
          onClick={handleVideoSubmit}
          className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
        >
          {upLoading ? "Uploading..." : "Upload"}
        </button>
      </div>
      <p className="text-red-700">{videoUploadError && videoUploadError}</p>
      {videoUrls.length > 0 &&
        videoUrls.map((url, index) => (
          <div
            key={url}
            className="flex justify-between p-3 border items-center"
          >
            <video
              src={url}
              controls
              className="w-20 h-20 object-cover rounded-lg"
            />
            <button
              onClick={() => handleRemoveVideo(index)}
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

export default VideoUploader;
