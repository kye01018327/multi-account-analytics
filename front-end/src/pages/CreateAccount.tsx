import { useNavigate } from "react-router-dom"


export default function CreateAccount() {
    let navigate = useNavigate()
    return (
        <>
            <div>Hello Create Account page</div>
            <button onClick={() => {navigate('/home')}}>Create Account</button>
        </>
    )
}