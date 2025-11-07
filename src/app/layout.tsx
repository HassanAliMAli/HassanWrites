import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { ThemeProvider } from '@/components/ThemeProvider';



const inter = Inter({ subsets: ['latin'] });



export const metadata: Metadata = {

  title: 'HassanWrites',

  description: 'A Medium-like blog built with Next.js and hosted on GitHub Pages.',

};



export default function RootLayout({

  children,

}: Readonly<{

  children: React.ReactNode;

}>) {

  return (

    <html lang="en" suppressHydrationWarning={true}>

      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

          <div className="flex flex-col min-h-screen">

            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">

              {children}

            </main>

            <Footer />

          </div>

        </ThemeProvider>

      </body>

    </html>

  );

}
