import type {
  TaobaoHomeResponse,
  TaobaoProductDetailResponse,
  TaobaoProductsResponse,
} from "@/types/taobao.types";

import httpCommon, { buildHeaders, handleServiceError } from "./api";

const getThemeProducts = (payload?: {
  themeId?: string;
  accessToken?: string;
}) => {
  const themeId = payload?.themeId ?? "11647";

  return httpCommon
    .get<TaobaoProductsResponse>(`/themes/${themeId}/products`, {
      headers: buildHeaders(payload?.accessToken),
    })
    .then((res) => res.data)
    .catch(handleServiceError);
};

const getHomepage = (payload?: { accessToken?: string }) => {
  return httpCommon
    .get<TaobaoHomeResponse>(`/homepage`, {
      headers: buildHeaders(payload?.accessToken),
    })
    .then((res) => res.data)
    .catch(handleServiceError);
};

const getProductBySourceItemId = (
  sourceItemId: string,
  payload?: { accessToken?: string },
) => {
  return httpCommon
    .get<TaobaoProductDetailResponse>(`/products/${sourceItemId}`, {
      headers: buildHeaders(payload?.accessToken),
    })
    .then((res) => res.data)
    .catch(handleServiceError);
};

const taobaoService = {
  getThemeProducts,
  getHomepage,
  getProductBySourceItemId,
};

export default taobaoService;
