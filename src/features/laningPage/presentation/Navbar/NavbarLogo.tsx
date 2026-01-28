import Image from "next/image";

export const NavbarLogo = () => {
    return (
        <>
            <Image
                src={"/brand/brand_logo_white.png"}
                width={200 / 1}
                height={45 / 1}
                alt="Howtojob Plus"
                style={{ objectFit: "contain" }}
                className="relative -top-2 hidden md:block"
            />
            <Image
                src={"/brand/brand_logo_white.png"}
                width={200 / 1.2}
                height={45 / 1.2}
                alt="Howtojob Plus"
                style={{ objectFit: "contain" }}
                className="relative -top-1 block md:hidden"
            />
            {/* <Image
                src={"/brand/htjp_logo_black.png"}
                width={40}
                height={40}
                alt="Howtojob Plus"
                style={{ objectFit: "contain" }}
                className="block md:hidden relative -top-1"
            /> */}
        </>
    );
};