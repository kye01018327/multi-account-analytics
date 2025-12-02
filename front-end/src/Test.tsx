import { useNavigate } from "react-router"
import { DisplayAllAccounts, DisplayAccountMastery } from "./shared_components/AccountComponents"

export default function Test() {
    let navigate = useNavigate()
    return (
        <>
            <div>Test page</div>
            <button onClick={() => {navigate('/')}}>Go Back</button>
            <br/><br/>
            <DisplayAllAccounts/>
            <br/><br/>
            <DisplayAccountMastery/>
        </>
    )
}