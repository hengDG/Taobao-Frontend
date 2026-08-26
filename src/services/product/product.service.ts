import type {
  TaobaoProductsResponse,
  TaobaoProductDetailResponse,
  TaobaoHomeResponse,
  ExploreProductsResponse,
} from "@/types/taobao.types";

import { buildHeaders, request } from "../api";
import axios from "axios";

export const getThemeProducts = async (
  themeId: string = "11647",
  accessToken?: string,
): Promise<TaobaoProductsResponse> => {
  // Prefer explicit Vite env var for direct backend URL, otherwise fall back to default proxy path
  const env = (import.meta as any)?.env;
  const base = env?.VITE_API_URL ?? "http://192.168.0.10:3168/api";

  const url = `${base.replace(/\/$/, "")}/themes/${themeId}/products`;

  const response = await axios.get<TaobaoProductsResponse>(url, {
    headers: buildHeaders(accessToken),
  });

  return response.data;
};

export const getProductDetail = async (
  productId: string,
  accessToken?: string,
): Promise<TaobaoProductDetailResponse> => {
  const env = (import.meta as any)?.env;
  const base = env?.VITE_API_URL ?? "http://192.168.0.10:3168/api";

  const url = `${base.replace(/\/$/, "")}/products/${productId}`;

  const response = await axios.get<TaobaoProductDetailResponse>(url, {
    headers: buildHeaders(accessToken),
  });

  return response.data;
};

export const getHomepageProducts = async (
  accessToken?: string,
): Promise<TaobaoHomeResponse> => {
  // Prefer explicit Vite env var for direct backend URL, otherwise fall back to default proxy path
  const env = (import.meta as any)?.env;
  const base = env?.VITE_API_URL ?? "http://192.168.0.10:3168/api";

  const url = `${base.replace(/\/$/, "")}/homepage`;

  const response = await axios.get<TaobaoHomeResponse>(url, {
    headers: buildHeaders(accessToken),
  });

  return response.data;
};

export const searchProducts = async (
  keyword: string,
  page = 1,
  size = 20,
  accessToken?: string,
): Promise<TaobaoProductsResponse> => {
  // Prefer explicit Vite env var for direct backend URL, otherwise fall back to default proxy path
  const env = (import.meta as any)?.env;
  const base = env?.VITE_API_URL ?? "http://192.168.0.10:3168/api";

  const url = `${base.replace(/\/$/, "")}/products/search`;

  const response = await axios.get<TaobaoProductsResponse>(url, {
    params: { keyword, page, size },
    headers: buildHeaders(accessToken),
  });

  return response.data;
};

export const getExploreProducts = async (
  cursor?: string,
  accessToken?: string,
): Promise<ExploreProductsResponse> => {

  const env = (import.meta as any)?.env;

  const base =
    env?.VITE_API_URL ??
    "http://192.168.0.10:3168/api";


  const url =
    `${base.replace(/\/*$/, "")}/explore`;


  const response =
    await axios.get<ExploreProductsResponse>(
      url,
      {
        params: cursor
          ? { cursor }
          : undefined,

        headers:
          buildHeaders(accessToken),
      }
    );


  return response.data;
};

export default {
  getThemeProducts,
  getProductDetail,
  getHomepageProducts,
  searchProducts,
  getExploreProducts,
};
