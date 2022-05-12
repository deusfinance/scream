import Head from 'next/head'

const Meta = () => {
    const title = 'SCREAM'
    const description = 'Scream is a highly scalable decentralized lending protocol powered by Fantom.'
    const url = 'https://scream.sh'

    return (
        <Head>
            <title>SCREAM</title>
            <meta name="description" content={description} />
            <meta property="og:type" content="website" />
            <meta name="og:title" property="og:title" content={title} />
            <meta name="og:description" property="og:description" content={description} />
            <meta property="og:site_name" content={title} />
            <meta property="og:url" content={url} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:site" content={url} />
            <meta name="twitter:creator" content="@al5ina5" />
            <link rel="icon" type="image/png" href="https://scream.sh/img/scream-blue-pink.png" />
            {/* <link rel="apple-touch-icon" href="/img/purple-set/012-social-network.svg" /> */}
            <meta property="og:image" content="https://scream.sh/img/og-image.png" />
            <meta name="twitter:image" content="https://scream.sh/img/og-image.png" />
        </Head>
    )
}

export default Meta
