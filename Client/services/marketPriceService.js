import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

export const fetchTodayMarketPrices = async () => {
  const res = await fetch(`${API_BASE_URL}/prices/today`);

  if (!res.ok) {
    throw new Error("Failed to fetch market prices");
  }

  return await res.json();
};
