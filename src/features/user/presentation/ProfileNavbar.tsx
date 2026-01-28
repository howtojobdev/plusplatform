"use client";

import { FloatingDock } from "@/shared/components/FloatingDock";
import { CircleUser, Dessert, MailSearch } from "lucide-react";

export const ProfileNavbar = () => {
    return (
        <div className="fixed w-full flex items-center justify-end px-4 md:justify-center bottom-4">
            <FloatingDock
                items={[
                    {
                        icon: <Dessert></Dessert>,
                        title: "Interviewly",
                        href: "/profile/interviewly"
                    },
                    {
                        icon: <CircleUser></CircleUser>,
                        title: "Profile",
                        href: "/profile"
                    },
                    {
                        icon: <MailSearch></MailSearch>,
                        title: "HelloHr",
                        href: "/profile/hellohr"
                    }
                ]}
            ></FloatingDock>
        </div>
    );
};