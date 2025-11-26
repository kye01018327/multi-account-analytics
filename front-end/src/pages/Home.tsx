import { useNavigate } from 'react-router'


function Home() {
    let navigate = useNavigate()
    return (
        <>
            <div>Home page</div>
            <button onClick={() => {navigate('/')}}>Log Out</button>
        </>
    )
}

export default Home