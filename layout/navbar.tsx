"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useSWR from "swr";
import { getFetcher } from "@/utils/request/fetcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ConnectKitButton } from "connectkit";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const MENU_ITEMS = [
  { label: "assets", value: "/assets" },
  { label: "staking", value: "/staking" },
  { label: "activity", value: "/staking/history" },
  { label: "rewards", value: "/rewards" },
  { label: "monitor", value: "/monitor" },
];

const Navbar = () => {
  const { data } = useSWR(
    "/users/me",
    getFetcher<{ role: string; username: string }>
  );
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 md:px-12">
        <Image src="/logo.png" width={60} height={40} alt="logo" />
        <NavigationMenu>
          <NavigationMenuList className="gap-6">
            {MENU_ITEMS.map((item) => (
              <NavigationMenuItem
                key={item.value}
                className={clsx(
                  "font-semibold rounded-lg px-2",
                  pathname === item.value
                    ? "bg-indigo-50 text-indigo-600"
                    : "bg-transparent text-black/70"
                )}
              >
                <NavigationMenuLink href={item.value} className="capitalize">
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex gap-2">
          <ConnectKitButton />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>
                  {data?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link href="/profile">
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
