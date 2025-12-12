/**
 * @deprecated 临时参考文件
 */
// import { REQUEST_URL } from "@/constants/common";
// import * as axios from "axios";
// import qs from "qs";

// export interface RequestConfig extends axios.AxiosRequestConfig {
//   contentType?: "json" | "form" | "file";
// }

// export const config: RequestConfig = {
//   baseURL: REQUEST_URL,
//   responseType: "json",
//   timeout: 120000, // 60s超时
//   withCredentials: false, // 是否允许携带cookie
//   transformRequest: [
//     function transformRequest(data, headers) {
//       if (headers) {
//         if (headers["Content-Type"] === "application/json") {
//           return JSON.stringify(data);
//         }
//         if (headers["Content-Type"] === "multipart/form-data") {
//           return data;
//         }
//       }
//       return qs.stringify(data);
//     },
//   ],
// };

// export const getContentType = (type?: RequestConfig["contentType"]) => {
//   switch (type) {
//     case "json":
//       return "application/json";
//     case "form":
//       return "application/x-www-form-urlencoded";
//     case "file":
//       return "multipart/form-data";
//     default:
//       return "application/json";
//   }
// };
