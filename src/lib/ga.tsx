import { Router } from 'next/router'
import { useEffect } from 'react'

export const { GA_TRACKING_ID } = process.env

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
    window.gtag('config', GA_TRACKING_ID, {
        page_path: url
    })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value
    })
}

export function useGoogleAnalytics() {
    useEffect(() => {
        const handleRouteChange = (url) => {
            pageview(url)
        }
        Router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
            Router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [])
}

export function GoogleAnalytics() {
    useGoogleAnalytics()
    return (
        <>
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-1XQP4SLYL2" />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_TRACKING_ID}');
      `
                }}
            />
        </>
    )
}
