import axios, { type AxiosRequestConfig } from "axios";

export const Config = {
  baseURL: "/api",
  productionMode: false,
};

export const createApiClient = (baseURL = Config.baseURL) =>
  axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 15000,
  });

export const httpCommon = createApiClient();

export const buildHeaders = (accessToken?: string) => ({
  ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
});

export const handleServiceError = (error: unknown) => {
  console.error("API Error:", error);
  return Promise.reject(
    error instanceof Error ? error : new Error("Request failed"),
  );
};

export const request = async <T>(
  endpoint: string,
  options: AxiosRequestConfig = {},
): Promise<T> => {
  try {
    const response = await httpCommon.request<T>({
      url: endpoint,
      ...options,
    });

    return response.data;
  } catch (error) {
    return handleServiceError(error);
  }
};

export default httpCommon;
