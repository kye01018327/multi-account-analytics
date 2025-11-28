import { useNavigate, useParams } from 'react-router'


function Profile() {
    const { username } = useParams()
    let navigate = useNavigate()
    return (
        <>
            <div>Hello, { username }</div>
            <button onClick={() => {navigate('/')}}>Log Out</button>
        </>
    )
}

export default Profile