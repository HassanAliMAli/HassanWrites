import { SignJWT, jwtVerify } from 'jose';

export const jsonResponse = (data, status = 200, extraHeaders = {}) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Adjust for prod
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            ...extraHeaders
        },
    });
};

export const errorResponse = (message, status = 400) => {
    return jsonResponse({ error: message }, status);
};

export const generateToken = async (payload, secret) => {
    const secretKey = new TextEncoder().encode(secret);
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secretKey);
};

export const verifyToken = async (token, secret) => {
    try {
        const secretKey = new TextEncoder().encode(secret);
        const { payload } = await jwtVerify(token, secretKey);
        return payload;
    } catch {
        return null;
    }
};
