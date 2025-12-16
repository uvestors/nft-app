// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { postFetcher } from "@/utils/request/fetcher";
// import { useTypedMutation } from "@/hooks/useTypedMutation";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import localStorage from "@/utils/storage";

// // 1. 定义 Zod Schema
// const schema = z.object({
//   username: z.string(),
//   password: z
//     .string()
//     .min(1, "Password is required")
//     .min(6, "Password must be at least 6 characters"),
// });

// export default function LoginPage() {
//   const router = useRouter();

//   const { trigger } = useTypedMutation("/auth/login", postFetcher, {
//     onSuccess(data) {
//       toast.success("Login successfully");
//       localStorage.set("rvi.token", data.access_token);
//       router.replace(data.role === "admin" ? "/assets" : "/balance");
//     },
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<z.infer<typeof schema>>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       username: "jweboy",
//       password: "123456",
//     },
//   });

//   const onSubmit = (values: z.infer<typeof schema>) => {
//     trigger(values);
//   };

//   return (
//     <div className="min-h-screen flex flex-col font-sans bg-white text-slate-900 relative overflow-hidden">
//       {/* 背景装饰 (模拟截图中的粒子效果) */}
//       <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
//         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-3xl opacity-50"></div>
//         <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-100/40 rounded-full blur-3xl opacity-50"></div>
//         {/* 模拟一些散落的小点 */}
//         <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full opacity-20"></div>
//         <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-20"></div>
//         <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-blue-400 rounded-full opacity-10"></div>
//       </div>

//       {/* 主要内容区域 */}
//       <main className="relative z-10 flex-grow flex items-center justify-center p-4">
//         <div className="w-full max-w-[420px]">
//           <div className="text-center mb-8">
//             <h1 className="bg-gradient-to-r from-cyan-500 to-pink-500 bg-clip-text text-transparent font-bold text-3xl">
//               RWA Tokenisation
//             </h1>
//           </div>

//           <div className="bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 rounded-2xl p-8">
//             {/* 4. 绑定 handleSubmit */}
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//               <div>
//                 <label
//                   htmlFor="username"
//                   className="block text-sm font-semibold text-slate-700 mb-2"
//                 >
//                   Username
//                 </label>
//                 {/* 5. 注册 input */}
//                 <input
//                   id="username"
//                   placeholder="name@company.com"
//                   className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all ${
//                     errors.username ? "border-red-500" : "border-slate-200"
//                   }`}
//                   {...register("username")}
//                 />
//                 {/* 错误提示 */}
//                 {errors.username && (
//                   <p className="mt-1 text-xs text-red-500">
//                     {errors.username.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <div className="flex justify-between items-center mb-2">
//                   <label
//                     htmlFor="password"
//                     className="block text-sm font-semibold text-slate-700"
//                   >
//                     Password
//                   </label>
//                   <Link
//                     href="#"
//                     className="text-xs font-medium text-cyan-600 hover:text-cyan-700 hover:underline"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>
//                 {/* 5. 注册 input */}
//                 <input
//                   type="password"
//                   id="password"
//                   placeholder="••••••••"
//                   className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all ${
//                     errors.password ? "border-red-500" : "border-slate-200"
//                   }`}
//                   {...register("password")}
//                 />
//                 {/* 错误提示 */}
//                 {errors.password && (
//                   <p className="mt-1 text-xs text-red-500">
//                     {errors.password.message}
//                   </p>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 text-white rounded-xl py-3.5 font-bold text-sm tracking-wide shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.01] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? "Signing In..." : "Sign In"}
//               </button>
//             </form>

//             <div className="relative flex py-6 items-center">
//               <div className="flex-grow border-t border-slate-100"></div>
//               <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-medium uppercase tracking-wider">
//                 Or continue with
//               </span>
//               <div className="flex-grow border-t border-slate-100"></div>
//             </div>

//             <button
//               type="button"
//               className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl px-4 py-3 transition-all duration-200 group"
//             >
//               <div className="relative w-5 h-5">
//                 <Image
//                   src="https://www.svgrepo.com/show/475656/google-color.svg"
//                   alt="Google"
//                   fill
//                   className="object-contain"
//                 />
//               </div>
//               <span>Sign in with Google</span>
//             </button>

//             <div className="mt-8 text-center">
//               <p className="text-sm text-slate-500">
//                 Don't have an account?{" "}
//                 <Link
//                   href="#"
//                   className="font-bold text-slate-900 hover:text-cyan-600 transition-colors"
//                 >
//                   Apply for Access
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
