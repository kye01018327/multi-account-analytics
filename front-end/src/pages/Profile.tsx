import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'


function Profile() {
    return (
        <>
            <ProfileName/>
            <ManageAccountsForm/>
            <DisplayAccounts/>
            <LogOutButton/>
        </>
    )
}


function ProfileName() {
    const [name, setName] = useState('')
    const { profileName } = useParams()
    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`http://127.0.0.1:5000/profiles/${profileName}`)
            if (!res.ok) {
                setName('ERROR')
                return
            }
            const data = await res.json()
            setName(data)
        }
        fetchData()
    }, [])

    return (
        <div>{ name }</div>
    )
}


function ManageAccountsForm() {
    const {profileName} = useParams()
    const [accountName, setAccountName] = useState('')

    async function handleLinkAccount() {
        const data = {profileName, accountName}
        console.log(data)
        const res = await fetch('http://127.0.0.1:5000/link_account', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        const result = await res.json()
        console.log(result)

    }

    async function handleUnlinkAccount() {

    }
    return (
        <>
            <input placeholder='Account' onChange={(e) => {setAccountName(e.target.value)}}/>
            <button onClick={handleLinkAccount}>Link Account</button>
            <button onClick={handleUnlinkAccount}>Unlink Account</button>
        </>
    )
}

function DisplayAccounts() {
    return (
        <></>
    )
}


function LogOutButton() {
    let navigate = useNavigate()
    return (
        <button onClick={() => {navigate('/')}}>Log Out</button>
    )
}

export default Profile