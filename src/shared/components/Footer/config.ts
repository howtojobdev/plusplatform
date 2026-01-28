export type FooterLink = { name: string; href: string };
export type FooterSection = { title: string; links: FooterLink[] };

export const footerConfig = {
    brand: {
        title: "YourCompany",
        href: "/",
    },
    description: "How to Job is your ultimate career sidekick, an ed-tech platform built for the fast-paced, ever-changing modern economy. Backed by expert insights and data-driven strategies, we deliver personalized guidance that keeps you ahead of industry shifts and sharpens the skills employers actually want.",
    social: [
        { label: "Instagram", href: "#" },
        { label: "Facebook", href: "#" },
        { label: "Twitter", href: "#" },
        { label: "LinkedIn", href: "#" },
    ],
    sections: [
        {
            title: "Products",
            links: [
                { name: "Howtojob Plus", href: "https://plus.howtojob.io/" },
                { name: "Interviewly", href: "https://www.interviewly.app/" },
                { name: "HelloHr", href: "https://www.hello-hr.app/" },
            ],
        },
        {
            title: "Company",
            links: [
                { name: "About", href: "#" },
                { name: "Team", href: "#" },
                { name: "Blog", href: "#" },
                { name: "Careers", href: "#" },
            ],
        },
        {
            title: "Resources",
            links: [
                { name: "Help", href: "#" },
                { name: "Sales", href: "#" },
                { name: "Advertise", href: "#" },
                { name: "Privacy", href: "#" },
            ],
        },
    ] satisfies FooterSection[],
    legal: [
        { name: "Terms and Conditions", href: "https://howtojob.io/wp-content/uploads/2025/12/Htj-Terms-of-Service.pdf" },
        { name: "Privacy Policy", href: "https://howtojob.io/wp-content/uploads/2025/12/Htj-Privacy-Policy.pdf" },
    ],
    copyright: "© 2026 How to Job Group Ltd. All rights reserved.",
};