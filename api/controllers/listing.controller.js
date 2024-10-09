import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id); // Find the listing by ID

  if (!listing) return next(errorHandler(404, "Listing not found")); // Return an error if the listing is not found

  if (req.user.id !== listing.userRef)
    return next(errorHandler(401, "You can only delete your own listings")); // Return an error if the user ID does not match the listing's userRef

  try {
    await Listing.findByIdAndDelete(req.params.id); // Delete the listing by ID
    res.status(200).json("Listing has been deleted..."); // Return a success message
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id); // Find the listing by ID

  if (!listing) return next(errorHandler(404, "Listing not found")); // Return an error if the listing is not found

  if (req.user.id !== listing.userRef)
    return next(errorHandler(401, "You can only update your own listings")); // Return an error if the user ID does not match the listing's userRef

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

//! Get a listing by ID - /api/listing/get/:id (Public Route)
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found"));
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

//! Get all listings - /api/listing/get (Public Route)

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    // Check if the offer query is set to true, false, or undefined and set the offer variable accordingly to filter the listings by offer status.
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, null] };
    }

    // Check if the furnished query is set to true, false, or undefined and set the furnished variable accordingly to filter the listings by furnished status.
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    // Check if the parking query is set to true, false, or undefined and set the parking variable accordingly to filter the listings by parking status.
    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    // Check if the type query is set to sale, rent, or undefined and set the type variable accordingly to filter the listings by type.
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || ""; // Set the searchTerm variable to the search query or an empty string if the search query is not set.

    const sort = req.query.sort || "createdAt"; // Set the sort variable to the sort query or 'createdAt' if the sort query is not set.

    const order = req.query.order || "desc"; // Set the order variable to the order query or 'desc' if the order query is not set.

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" }, // Filter the listings by name using a case-insensitive regular expression.
      offer,
      furnished,
      parking,
      type,
    })
      .sort({
        [sort]: order, // Sort the listings by the sort query in the order query.
      })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
