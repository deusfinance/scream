module.exports = {
    async redirects() {
        return [
            {
                source: '/chat',
                destination: 'https://discord.gg/ygdefWwWzC',
                permanent: true
            },
            {
                source: '/discord',
                destination: 'https://discord.gg/ygdefWwWzC',
                permanent: true
            },
            {
                source: '/telegram',
                destination: 'https://t.me/screamsh',
                permanent: true
            },
            {
                source: '/github',
                destination: 'https://github.com/screamsh',
                permanent: true
            },
            {
                source: '/medium',
                destination: 'https://screamsh.medium.com',
                permanent: true
            },
            {
                source: '/twitter',
                destination: 'https://twitter.com/screamdotsh',
                permanent: true
            }
        ]
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack']
        })

        return config
    }
}
