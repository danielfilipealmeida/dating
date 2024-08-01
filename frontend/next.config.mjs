/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.graphql/,
            use: [
                options.defaultLoaders.webpack,
                {
                    loader: 'graphql-tag/loader',
                    //options: pluginOptions.options,
                }
            ]
        })
        return config
    }
};

export default nextConfig;
