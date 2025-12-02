import { useState } from 'react'
import { useNavigate } from 'react-router'


export default function Login() {
    return (
        <>
            <Title/>
            <ProfileForm/>
        </>
    )
}

function Title() {
    return (
        <div>Login Page</div>
    )
}

function ProfileForm() {
    const [profileName, setProfileName] = useState('')
    const [message, setMessage] = useState('')
    let navigate = useNavigate()

    async function handleViewProfile(e: any) {
        e.preventDefault()
        if (profileName == '') {
            setMessage('Profile name cannot be blank')
            return
        }
        const res = await fetch(`http://127.0.0.1:5000/profiles/${profileName}`)
        if (!res.ok) {
            setMessage('Profile does not exist')
            return
        }
        const data = await res.json()
        if (data[0] != '') {
            navigate(`/profile/${profileName}`)
        }
    }

    async function handleCreateProfile(e: any) {
        e.preventDefault()
        if (profileName == '') {
            setMessage('Profile name cannot be blank')
            return
        }
        const res = await fetch('http://127.0.0.1:5000/create_profile', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({profileName})
        })
        if (!res.ok) {
            console.log('ERROR something happened')
        }
        const result = await res.json()
        console.log(result['message'])
        setMessage(result['message'])
    }

    async function handleDeleteProfile(e: any) {
        e.preventDefault()
        if (profileName == '') {
            setMessage('Profile name cannot be blank')
            return
        }
        const query = new URLSearchParams({profileName}).toString()
        const res = await fetch(`http://127.0.0.1:5000/delete_profile?${query}`, { method: 'DELETE' })
        if (!res.ok) {
            console.log('ERROR something happened couldnt delete profile')
            return
        }
        const result = await res.json()
        setMessage(result['message'])
    }

    function handleViewAccounts(e: any) {
        e.preventDefault()
        navigate('/accounts')
    }

    return (
        <>
            <input onChange={(e) => {
                setProfileName(e.target.value)}
            } name='Username' placeholder='Username'/>
            
            <button onClick={handleViewProfile}>View Profile</button>
            <button onClick={handleCreateProfile}>Create Profile</button>
            <button onClick={handleDeleteProfile}>Delete Profile</button>
            <br/><br/>
            <div>{message}</div>
            <hr/>
            <div>For testing:</div>
            <br/>
            <button onClick={handleViewAccounts}>View Accounts</button>
            <button onClick={() => {navigate('/test')}}>Go to Test Page</button>
        </>
    )
}