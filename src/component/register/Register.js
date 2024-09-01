import React, { useRef, useState } from 'react';
import '../login/login.css';
import { Link, useNavigate } from 'react-router-dom';
import firebaseApp from '../../firebase';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase'; // Ensure you import storage from your Firebase configuration
import '@fortawesome/fontawesome-free/css/all.min.css';


const auth = getAuth(firebaseApp);

const Register = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSelectFile = (e) => {
    setFile(e.target.files[0])
    setImageUrl(URL.createObjectURL(e.target.files[0]))
  }

  const submitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true)
    console.log(email, password);
    createUserWithEmailAndPassword(auth, email, password)
      .then(newUser => {
        console.log(newUser);
        const date = new Date().getTime();
        const storageRef = ref(storage, `${displayName}${date}`);
        uploadBytesResumable(storageRef, file)
          .then(res => {
            console.log(res);
            getDownloadURL(storageRef)
              .then(downloadedURL => {
                console.log(downloadedURL);

                updateProfile(newUser.user, {
                  displayName,
                  photoURL: downloadedURL
                }).then(() => {
                  setDoc(doc(db, 'users', newUser.user.uid), {
                    uid: newUser.user.uid,
                    displayName: displayName,
                    email: email,
                    photoURL: downloadedURL
                  });

                  navigate('/dashboard');
                  setIsLoading(false)
                  localStorage.setItem('cName', displayName);
                  localStorage.setItem('photoURL', downloadedURL);
                  localStorage.setItem('email', newUser.user.email);
                  localStorage.setItem('uid', newUser.user.uid);
                });
              });
          });
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err);
      });

  };

  return (
    <div className='login-wrapper'>
      <div className='login-container'>
        <div className='login-boxes login-left'>
        </div>

        <div className='login-boxes login-right'>
          <h2 className='login-heading'>Create an Account</h2>

          <form onSubmit={submitHandler}>
            <input required onChange={(e) => setDisplayName(e.target.value)} className='login-text' type="text" placeholder='Company Name' />
            <input required onChange={(e) => setEmail(e.target.value)} className='login-text' type="text" placeholder='Enter Email' />
            <input required onChange={(e) => setPassword(e.target.value)} className='login-text' type="password" placeholder='Enter Password' />
            <input required style={{ display: 'none' }} className='upload-input' type="file" ref={fileInputRef} onChange={(e) => onSelectFile(e)} />
            <input required className='upload-input' type="button" value='Upload Logo' onClick={() => fileInputRef.current.click()} />
            {imageUrl !== null && <img className='image-preview' src={imageUrl} alt="Preview" />}
            <button className='button login-btn' type="submit">{isLoading ? <i className="fa-solid fa-spinner fa-spin-pulse"></i> : null}Register</button>
          </form>
          <Link to='/login' className='register-link'>Login with Email</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
