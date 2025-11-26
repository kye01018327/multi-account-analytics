import { useNavigate } from "react-router-dom"


export default function SignUp() {
    let navigate = useNavigate()
    return (
        <>
            <div>Hello SignUp page</div>
            <button onClick={() => {navigate('/home')}}>Create Account</button>
        </>
    )
}