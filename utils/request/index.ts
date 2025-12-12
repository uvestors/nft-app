import axios, { AxiosRequestConfig } from "axios";
// import localStorage from "../storage";
import { toast } from "sonner";
import { API_URL } from "@/constants";

interface RequestConfig extends AxiosRequestConfig {
  showToast?: boolean;
}

const http = axios.create({
  baseURL: API_URL,
  timeout: 60 * 1000, // 一分钟超时
});

/**
 * @name 根据请求方式获取指定的 Content-Type
 * @param type
 * @returns
 */
const getContentType = (type?: RequestConfig["method"]) => {
  switch (type) {
    case "POST":
    case "GET":
      return "application/json";
    default:
      return "application/json";
  }
};

// 发起请求的拦截中间件
http.interceptors.request.use(
  function (config) {
    // if (config.headers) {
    //   const userToken = localStorage.get("userToken");

    //   config.headers["Content-Type"] = getContentType(config.method);

    //   if (userToken != null) {
    //     config.headers.Authorization = `Bearer ${userToken}`;
    //   }
    // }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 响应请求的拦截中间件
http.interceptors.response.use(
  function (response) {
    const { data, config } = response;
    const { code, message } = data;
    const { showToast = true } = config as RequestConfig;

    if (code === 0) {
      return data;
    }

    //  无效 token
    if (code === 1001 || code === 1000) {
      setTimeout(() => {
        window.location.href = "/signin";
      }, 300);
    }

    if (showToast) {
      toast.dismiss();
      toast.error(message);
    }
    return Promise.reject(message);
  },
  function (error) {
    console.log(error);
    // invlid token 10000
    const { status, response } = error;
    const { message } = response;

    // 请求错误，一般是参数不正确引起
    if (status === 400) {
      toast.dismiss();
      toast.error(message);
      return Promise.reject(message);
    }

    return Promise.reject(error);
  }
);

const request = <T>(url: string, options: RequestConfig) => {
  // 拼接完整请求地址
  options.url = API_URL + url;

  return http(options).then((data) => data as T);
};

export default request;
