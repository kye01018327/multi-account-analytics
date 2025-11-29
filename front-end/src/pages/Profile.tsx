import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'


function Profile() {
    const [profilename, setProfilename] = useState('')
    const { param } = useParams()
    let navigate = useNavigate()
    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`http://127.0.0.1:5000/profiles/${param}`)
            if (!res.ok) {
                setProfilename('ERROR')
                return
            }
            const data = await res.json()
            setProfilename(data)
        }
        fetchData()
    }, [])
    return (
        <>
            <div>Hello, { profilename }</div>
            <button onClick={() => {navigate('/')}}>Log Out</button>
        </>
    )
}

export default Profile