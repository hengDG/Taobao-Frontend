import type {
  TaobaoHomeResponse,
  TaobaoProductDetailResponse,
  TaobaoProductsResponse,
} from "@/types/taobao.types";

import { buildHeaders, request } from "../api";

export const getThemeProducts = async (
  themeId = "11647",
  accessToken?: string,
): Promise<TaobaoProductsResponse> => {
  return request<TaobaoProductsResponse>(`/themes/${themeId}/products`, {
    headers: buildHeaders(accessToken),
  });
};

export const getProductDetail = async (
  productId: string,
  accessToken?: string,
): Promise<TaobaoProductDetailResponse> => {
  return request<TaobaoProductDetailResponse>(`/products/${productId}`, {
    headers: buildHeaders(accessToken),
  });
};

export const getHomepageProducts = async (
  accessToken?: string,
): Promise<TaobaoHomeResponse> => {
  return request<TaobaoHomeResponse>(`/homepage`, {
    headers: buildHeaders(accessToken),
  });
};

export const searchProducts = async (
  keyword: string,
  page = 1,
  size = 20,
  accessToken?: string,
): Promise<TaobaoProductsResponse> => {
  return request<TaobaoProductsResponse>(`/products/search`, {
    params: { keyword, page, size },
    headers: buildHeaders(accessToken),
  });
};

export default {
  getThemeProducts,
  getProductDetail,
  getHomepageProducts,
  searchProducts,
};
