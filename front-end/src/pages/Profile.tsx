import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'


function Profile() {
    return (
        <>
            <ProfileName/>
            <LogOutButton/>
        </>
    )
}


function ProfileName() {
    const [profilename, setProfilename] = useState('')
    const { param } = useParams()
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
        <div>{ profilename }</div>
    )
}


function LogOutButton() {
    let navigate = useNavigate()
    return (
        <button onClick={() => {navigate('/')}}>Log Out</button>
    )
}

export default Profile