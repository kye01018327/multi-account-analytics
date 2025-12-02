import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { splitAccountName } from '../utils'


export default function Profile() {
    let navigate = useNavigate()
    const [name, setName] = useState('')
    const { profileName } = useParams()
    const [accounts, setAccounts] = useState([])
    const [update, setUpdate] = useState(true)
    const [message, setMessage] = useState('')
    const [accountName, setAccountName] = useState('')
    const [profileMastery, setProfileMastery] = useState(-1)


    async function fetchProfileMastery() {
        const query = new URLSearchParams({ profileName: profileName as string })
        const res = await fetch(`http://127.0.0.1:5000/fetch_profile_total_mastery?${query}`)
        if (!res.ok) {
            setMessage('ERROR something happened')
            return
        }
        const result = await res.json()
        setProfileMastery(result)
    }


    async function fetchData() {
        const res = await fetch(`http://127.0.0.1:5000/profiles/${profileName}`)
        if (!res.ok) {
            setName('ERROR')
            return
        }
        const d = await res.json()
        setName(d['profile_name'])
        setAccounts(d['accounts'])
    }


    useEffect(() => {
        fetchData()
        fetchProfileMastery()
    }, [update])


    async function handleLinkAccount() {
        const [gameName, tagLine] = splitAccountName(accountName)
        const data = {profileName, gameName, tagLine}
        const res = await fetch('http://127.0.0.1:5000/link_account', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        const result = await res.json()
        console.log(result)
    }

    async function handleUnlinkAccount() {
        const [gameName, tagLine] = splitAccountName(accountName)
        const data = {profileName, gameName, tagLine}
        const res = await fetch('http://127.0.0.1:5000/unlink_account', {
            'method': 'POST',
            'headers': {'Content-Type': 'application/json'},
            'body': JSON.stringify(data)
        })
        const result = await res.json()
        console.log(result)
    }

    async function handleUpdateMastery() {
        const data = {profileName}
        const res = await fetch('http://127.0.0.1:5000/update_profile_mastery', {
            'method': 'PATCH',
            'headers': {'Content-Type': 'application/json'},
            'body': JSON.stringify(data)
        })
        const result = await res.json()
        console.log(result)
        setUpdate(update => !update)
    }

    return (
        <>
            {/* Link / Unlink Accounts feature */}
            <input placeholder='Account' onChange={(e) => {setAccountName(e.target.value)}}/>
            <button onClick={handleLinkAccount}>Link Account</button>
            <button onClick={handleUnlinkAccount}>Unlink Account</button>

            {/* Logout Button */}
            <button onClick={() => {navigate('/')}}>Log Out</button>
            
            <br/>
            <br/>

            {/* Profile Name */}
            <hr/>
            <div>Profile: { name }</div>

            {/* Update Button */}
            <hr/>
            <button onClick={handleUpdateMastery}>Update</button>
            {/* Display Profile Total Mastery */}
            <hr/>
            <div>Profile Total Mastery</div>
            <br/>
            {profileMastery}

            {/* Display Linked Accounts */}
            <hr/>
            <div>Linked Accounts</div>
            <ul>
                {accounts.map((account: any, index: any) => (
                    <li key={index}>
                        {account}
                    </li>
                ))}
            </ul>
        </>
    )
}