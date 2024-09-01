import React, {useState} from 'react'
import './login.css'
import { Link, useNavigate } from 'react-router-dom'
import {auth} from '../../firebase'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true)
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user)
      localStorage.setItem('cName',user.displayName)
      localStorage.setItem('photoURL',user.photoURL)
      localStorage.setItem('email',user.email)
      localStorage.setItem('uid',user.uid)
      navigate('/dashboard')
      setIsLoading(false)
    })
    .catch((error) => {
      console.log(error)
      setIsLoading(false)
    });
  }



  return (
    <div className='login-wrapper'>
      <div className='login-container'>
        <div className='login-boxes login-left'>
        </div>

        <div className='login-boxes login-right'>
          <h2 className='login-heading'>Login</h2>
          <form onSubmit={submitHandler}>
            <input required onChange={(e) => { setEmail(e.target.value) }} className='login-text' type="text" placeholder='Enter Email' />
            <input required onChange={(e) => { setPassword(e.target.value) }} className='login-text' type="password" placeholder='Enter Password' />
            <button className='button login-btn' type="submit">{isLoading ? <i className="fa-solid fa-spinner fa-spin-pulse"></i> : null}Login</button>

          </form>
          <Link to='/register' className='register-link'>Create an Account</Link>
        </div>

      </div>

    </div>
  )
}

export default Login