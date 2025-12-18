import axios from "axios";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

// ----------------------
// Create a new prebooking
// ----------------------
export const createPrebooking = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/prebooking/create`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating prebooking:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create prebooking");
  }
};

// ----------------------
// Get all prebookings for a user
// ----------------------
export const getUserPrebookings = async (user_id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/prebooking/user/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching prebookings:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch prebookings");
  }
};

// ----------------------
// Update prebooking status
// ----------------------
export const updatePrebookingStatus = async (prebooking_id, status) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/prebooking/update-status`, {
      prebooking_id,
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating prebooking status:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update prebooking status");
  }
};
