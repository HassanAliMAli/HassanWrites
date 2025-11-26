// Helper to generate Article Schema
export const generateArticleSchema = ({
    headline,
    image,
    datePublished,
    dateModified,
    authorName,
    description,
    url
}) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    image: image ? [image] : [],
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
        '@type': 'Person',
        name: authorName,
    },
    publisher: {
        '@type': 'Organization',
        name: 'EdgeMaster',
        logo: {
            '@type': 'ImageObject',
            url: 'https://ui-avatars.com/api/?name=Edge+Master&background=000&color=fff', // Placeholder
        },
    },
    description,
    mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
    },
});

// Helper to generate Person Schema
export const generatePersonSchema = ({ name, url, image, sameAs = [] }) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
    image,
    sameAs,
});
