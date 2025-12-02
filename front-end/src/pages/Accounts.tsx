import { useState } from "react"
import { useNavigate } from "react-router"
import { DisplayAllAccounts } from '../shared_components/AccountComponents'
import { splitAccountName } from "../utils"


export default function Accounts() {
    return (
        <>
            <ManageAccountsForm/>
            <GoBackButton/>
            <DisplayAllAccounts/>
        </>
    )
}


function ManageAccountsForm() {
    const [accountName, setAccountName] = useState('')
    const [debugMsg, setDebugMsg] = useState('')
    

    async function handleAddAccount() {
        if (accountName == '') {
            setDebugMsg('account name cannot be blank')
            return
        }
        const [gameName, tagLine] = splitAccountName(accountName)
        const data = {gameName, tagLine}
        const res = await fetch('http://127.0.0.1:5000/add_account', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        const result = await res.json()
        setDebugMsg(result['message'])
    }

    async function handleRemoveAccount() {
        if (accountName == '') {
            setDebugMsg('account name cannot be blank')
            return
        }
        const [gameName, tagLine] = splitAccountName(accountName)
        const data = {gameName, tagLine}
        const res = await fetch('http://127.0.0.1:5000/remove_account', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(data)
        })
        const result = await res.json()
        setDebugMsg(result['message'])

    }
    return (
        <>
            <input placeholder='Account' onChange={(e) => {setAccountName(e.target.value)}}/>
            <button onClick={handleAddAccount}>Add Account</button>
            <button onClick={handleRemoveAccount}>Remove Account</button>
            <br/>
            {debugMsg}
            <br/>
        </>
    )
}

function GoBackButton() {
    const navigate = useNavigate()
    return (
        <button onClick={() => navigate('/')}>Go back</button>
    )
}