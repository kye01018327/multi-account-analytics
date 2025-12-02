import { useNavigate } from "react-router"
import { TestComponent } from "./shared_components/AccountComponents"

export default function Test() {
    let navigate = useNavigate()
    return (
        <>
            <div>Test page</div>
            <br/>
            <button onClick={() => {navigate('/')}}>Go Back</button>
            
            <hr/>
            <TestComponent/>
            <hr/>
        </>
    )
}