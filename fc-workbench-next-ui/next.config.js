const process = require("next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss");
/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BASE_URL: 'http://localhost:5000'
    },
    reactStrictMode: false
};

module.exports = nextConfig;
