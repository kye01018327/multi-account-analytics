import { useEffect, useState } from "react"
import { splitAccountName } from "../utils"

export function TestComponent() {
    const [accounts, setAccounts] = useState([])
    const [update, setUpdate] = useState(true)
    const [accountName, setAccountName] = useState('')
    const [totalMastery, setTotalMastery] = useState()
    
    async function handleSubmit() {
        // Send GET request to server's get masteries JSON endpoint
        const [gameName, tagLine] = splitAccountName(accountName)
        const query = new URLSearchParams({ gameName, tagLine }).toString()
        const res = await fetch(`http://127.0.0.1:5000/fetch_account_total_mastery?${query}`, {method: 'GET'})
        const result = await res.json()
        setTotalMastery(result)
    }
    useEffect(() => {
        async function getAccounts() {
            const res = await fetch(`http://127.0.0.1:5000/allaccounts`)
            const result = await res.json()
            setAccounts(result)
        }
        getAccounts()
    }, [update])

    return (
        <>
            <div>GET Total mastery score of account</div>
            <input placeholder='Enter account name' onChange={(e) => {setAccountName(e.target.value)}}/>
            <button onClick={handleSubmit}>Submit</button>
            <div>{totalMastery}</div>
            <hr/>
            <button onClick={() => {setUpdate(!update)}}>Update</button>
            <div>Account Names</div>
            <div>Mastery Scores</div>
            <ul>
                {accounts.map((account, index) => (
                    <li key={index}>
                        {account['accountName']}
                        <br/>
                        {account['totalMastery']}
                        <br/><br/>
                    </li>
                ))}
            </ul>
        </>
    )
}