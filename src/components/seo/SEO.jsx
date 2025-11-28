import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEO = ({
    title,
    description,
    canonical,
    openGraph,
    twitter,
    type = 'website'
}) => {
    const siteName = 'HassanWrites';
    const defaultTitle = 'HassanWrites - Insights and Stories';
    const defaultDescription = 'A modern publishing platform for the edge era.';
    const defaultImage = 'https://images.unsplash.com/photo-1499750310159-5b5f226932b7?w=1200&h=630&q=80';

    const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
    const metaDescription = description || defaultDescription;
    const ogImage = openGraph?.image || defaultImage;
    const ogUrl = canonical || window.location.href;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:title" content={title || defaultTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:url" content={ogUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title || defaultTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={ogImage} />
            {twitter?.creator && <meta name="twitter:creator" content={twitter.creator} />}
        </Helmet>
    );
};
