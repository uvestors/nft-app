"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useSWR from "swr";
import { getFetcher } from "@/utils/request/fetcher";

const Navbar = () => {
  const { data } = useSWR(
    "/users/me",
    getFetcher<{ role: string; username: string }>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 md:px-12">
        <Image src="/logo.png" width={60} height={40} alt="logo" />
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>
            {data?.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {/* <ConnectKitButton mode="light" /> */}
      </div>
    </header>
  );
};

export default Navbar;
