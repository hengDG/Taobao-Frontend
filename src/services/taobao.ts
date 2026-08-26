// import type {
//   TaobaoHomeResponse,
//   TaobaoProductDetailResponse,
//   TaobaoProductsResponse,
// } from "@/types/taobao.types";

// import { buildHeaders, request } from "./api";

// const getThemeProducts = async (payload?: {
//   themeId?: string;
//   accessToken?: string;
// }) => {
//   const themeId = payload?.themeId ?? "11647";

//   return request<TaobaoProductsResponse>(`/themes/${themeId}/products`, {
//     headers: buildHeaders(payload?.accessToken),
//   });
// };

// const getHomepage = async (payload?: { accessToken?: string }) => {
//   return request<TaobaoHomeResponse>(`/homepage`, {
//     headers: buildHeaders(payload?.accessToken),
//   });
// };

// const getProductBySourceItemId = async (
//   sourceItemId: string,
//   payload?: { accessToken?: string },
// ) => {
//   return request<TaobaoProductDetailResponse>(`/products/${sourceItemId}`, {
//     headers: buildHeaders(payload?.accessToken),
//   });
// };

// const searchProducts = async (
//   query: string,
//   payload?: { accessToken?: string },
// ) => {
//   return request<TaobaoProductsResponse>(`/search`, {
//     params: { q: query },
//     headers: buildHeaders(payload?.accessToken),
//   });
// };

// const taobaoService = {
//   getThemeProducts,
//   getHomepage,
//   getProductBySourceItemId,
//   searchProducts,
// };

// export default taobaoService;
