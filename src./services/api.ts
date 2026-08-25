import axios from "axios";

export const Config = {
  baseURL: "http://localhost:3168/api",
  productionMode: false,
};

export const createApiClient = (baseURL = Config.baseURL) =>
  axios.create({
    baseURL,
    headers: {
      "Content-type": "application/json",
    },
  });

export const httpCommon = createApiClient();

export const buildHeaders = (accessToken?: string) => ({
  ...(accessToken ? { token: accessToken } : {}),
});

export const handleServiceError = (error: unknown) => {
  console.error(error);
  return Promise.reject(
    error instanceof Error ? error : new Error("Request failed"),
  );
};

export default httpCommon;
