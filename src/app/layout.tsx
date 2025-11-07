import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { ThemeProvider } from '@/components/ThemeProvider';



const inter = Inter({ subsets: ['latin'] });



export const metadata: Metadata = {



  title: {



    default: 'HassanWrites',



    template: '%s | HassanWrites',



  },



  description: 'A Medium-like blog built with Next.js and hosted on GitHub Pages.',



  keywords: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Blog'],



  authors: [{ name: 'Hassan' }],



  openGraph: {



    title: 'HassanWrites',



    description: 'A Medium-like blog built with Next.js and hosted on GitHub Pages.',



    url: 'https://HassanAliMAli.github.io/HassanWrites',



    siteName: 'HassanWrites',



    images: [



      {



        url: 'https://HassanAliMAli.github.io/HassanWrites/og-image.png',



        width: 1200,



        height: 630,



      },



    ],



    locale: 'en_US',



    type: 'website',



  },



  twitter: {



    card: 'summary_large_image',



    title: 'HassanWrites',



    description: 'A Medium-like blog built with Next.js and hosted on GitHub Pages.',



    creator: '@hassan',



    images: ['https://HassanAliMAli.github.io/HassanWrites/og-image.png'],



  },



};







export default function RootLayout({

  children,

}: Readonly<{

  children: React.ReactNode;

}>) {

  return (

    <html lang="en" suppressHydrationWarning={true}>

            <head>

              <link rel="manifest" href="/manifest.json" />

              <script defer data-domain="YOUR_DOMAIN" src="https://plausible.io/js/script.js"></script>

            </head>

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


