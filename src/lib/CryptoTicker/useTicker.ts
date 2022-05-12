import useSWR from 'swr'

export default function useTicker() {
    const { data } = useSWR('/api/prices')

    return { data }
}
