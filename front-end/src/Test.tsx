import { useEffect, useState } from "react"

export default function Test() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch('http://127.0.0.1:5000/profiles/test')
                console.log(res)
                const data = await res.json()
                setData(data)
            } finally {
                setLoading(false)
            }
        }

        loadData()
        }, [])
        
    if (loading) return <div>Loading...</div>

    return (
        <>
            <div>Test page</div>
            <div>{JSON.stringify(data)}</div>
        </>
    )
}