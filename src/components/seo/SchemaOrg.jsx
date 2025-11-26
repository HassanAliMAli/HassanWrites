import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SchemaOrg = ({ schema }) => {
    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
};
