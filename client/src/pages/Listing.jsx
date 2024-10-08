import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

function Listing() {
  SwiperCore.use([Navigation]); // Add the Navigation module to SwiperCore to enable navigation arrows
  const [listing, setListing] = useState(null); // Create a state variable to store the listing data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const params = useParams(); // Get the listing ID from the URL

  // Fetch the listing data from the server when the component mounts using the listing ID from the URL params and store it in the state variable "listing" using the setListing function provided by the useState hook
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        console.log(data);
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  console.log(loading);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading ...</p>}
      {error && (
        <p className="text-center my-7 text-2xl text-red-500">
          An error occurred
        </p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat `,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </main>
  );
}

export default Listing;
