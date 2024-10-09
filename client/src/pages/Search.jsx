import { set } from "mongoose";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Search() {
  const navigate = useNavigate(); // Get the navigate function from the useNavigate hook
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);

  console.log(listings);

  //! Get the search query from the URL and set it to the sidebar data state when the component mounts or the URL changes

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search); // Create a new URLSearchParams object from the current URL search params
    const searchTermFromUrl = urlParams.get("searchTerm"); // Get the search query from the URL search params
    const typeFromUrl = urlParams.get("type"); // Get the type query from the URL search params
    const parkingFromUrl = urlParams.get("parking"); // Get the parking query from the URL search params
    const furnishedFromUrl = urlParams.get("furnished"); // Get the furnished query from the URL search params
    const offerFromUrl = urlParams.get("offer"); // Get the offer query from the URL search params
    const sortFromUrl = urlParams.get("sort"); // Get the sort query from the URL search params
    const orderFromUrl = urlParams.get("order"); // Get the order query from the URL search params

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    } // Set the sidebar data based on the search query from the URL

    const fetchListings = async () => {
      setLoading(true);

      const searchQuery = urlParams.toString(); // Convert the URLSearchParams object to a string
      const res = await fetch(`/api/listing/get?${searchQuery}`); // Fetch the listings based on the search query
      const data = await res.json(); // Get the JSON data from the response
      setListings(data); // Set the listings state to the data
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);

  //! Handle the form submission and set the search query to the URL when the form is submitted
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    } // Set the type variable based on the checkbox value

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    } // Set the type and searchTerm variables based on the input value

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    } // Set the parking, furnished, and offer variables based on the checkbox value

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0]; // Get the sort value from the select value
      const order = e.target.value.split("_")[1]; // Get the order value from the select value
      setSidebardata({ ...sidebardata, sort, order }); // Set the sort and order variables based on the select value
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(); // Create a new URLSearchParams object
    urlParams.set("searchTerm", sidebardata.searchTerm); // Set the search query to the searchTerm state
    urlParams.set("type", sidebardata.type); // Set the type query to the type state
    urlParams.set("parking", sidebardata.parking); // Set the parking query to the parking state
    urlParams.set("furnished", sidebardata.furnished); // Set the furnished query to the furnished state
    urlParams.set("offer", sidebardata.offer); // Set the offer query to the offer state
    urlParams.set("sort", sidebardata.sort); // Set the sort query to the sort state
    urlParams.set("order", sidebardata.order); // Set the order query to the order state
    const searchQuery = urlParams.toString(); // Convert the URLSearchParams object to a string
    navigate(`/search?${searchQuery}`); // Navigate to the search page with the search query
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search"
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "all"} // Check if the type is set to all
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.offer} // Check if the offer is set to true
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.parking} // Check if the parking is set to true
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label>Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"} // Set the default value to 'created_at_desc'
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value={"regularPrice_desc"}>Price high to low</option>
              <option value={"regularPrice_asc"}>Price low to high</option>
              <option value={"createdAt_desc"}>Latest</option>
              <option value={"createdAt_asc"}>Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div>
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
      </div>
    </div>
  );
}

export default Search;
