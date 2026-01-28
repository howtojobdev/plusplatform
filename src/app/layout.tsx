import './globals.css';
import './dataset-style.css';
import { OverlayWrapper } from '@/shared/wrappers/OverlayWrapper';
import { Inter, Poppins } from 'next/font/google';
import { SessionWrapper } from '@/shared/wrappers/SessionWrapper';
import { Metadata } from 'next';
import { InitStateWrapper } from '@/shared/wrappers/InitStateWrapper';
import Footer from '@/shared/components/Footer';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['600', '700', '800', '900'],
    variable: '--font-poppins',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Howtojob Plus',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" data-theme="dark" className={`${inter.variable} ${poppins.variable}`}>
            <body className='scrollbar'>
                <SessionWrapper>
                    <InitStateWrapper>
                        <OverlayWrapper>
                            {children}
                            <Footer></Footer>
                        </OverlayWrapper>
                    </InitStateWrapper>
                </SessionWrapper>
            </body>
        </html>
    );
}