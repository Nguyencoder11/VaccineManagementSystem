import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../header/header'
import { useState, useEffect } from 'react'

function LoginForm({children}){
    const [isCssLoaded, setCssLoaded] = useState(false);
    useEffect(()=>{
        import('../loginlayout/stylelogin.scss').then(() => setCssLoaded(true));
    }, []);
    if (!isCssLoaded) {
        return <></>
    }
    return(
        <div>
            <Header/>
            {children}
        </div>
        
    );
}
export default LoginForm;