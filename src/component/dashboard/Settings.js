import React, { useState, useRef } from 'react';
import { storage, auth, db } from '../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';

const Settings = () => {
  const fileInputRef = useRef(null);

  const [displayName, setDisplayName] = useState(localStorage.getItem('cName') || '');
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(localStorage.getItem('photoURL') || '');
  const [bankName, setBankName] = useState(localStorage.getItem('bankName') || '');
  const [ownerName, setOwnerName] = useState(localStorage.getItem('ownerName') || '');
  const [accountNumber, setAccountNumber] = useState(localStorage.getItem('accountNumber') || '');

  const handleUpdateAll = () => {
    const promises = [];

    // Update profile picture if a new file is selected
    if (file) {
      const fileRef = ref(storage, `user-profiles/${auth.currentUser.uid}/profile-pic.jpg`);
      const uploadTask = uploadBytesResumable(fileRef, file)
        .then(snapshot => getDownloadURL(snapshot.ref))
        .then(downloadURL => {
          promises.push(updateProfile(auth.currentUser, { photoURL: downloadURL }));
          localStorage.setItem('photoURL', downloadURL);
          setImageUrl(downloadURL);
        })
        .catch(error => {
          alert('Failed to update profile picture: ' + error.message);
        });
    }

    // Update display name
    if (displayName) {
      promises.push(
        updateProfile(auth.currentUser, { displayName }).then(() => {
          localStorage.setItem('cName', displayName);
        }).catch(error => {
          alert('Failed to update company name: ' + error.message);
        })
      );
    }

    // Update bank details
    const bankDetails = { bankName, ownerName, accountNumber };
    promises.push(
      updateDoc(doc(db, 'users', localStorage.getItem('uid')), bankDetails).then(() => {
        localStorage.setItem('bankName', bankName);
        localStorage.setItem('ownerName', ownerName);
        localStorage.setItem('accountNumber', accountNumber);
      }).catch(error => {
        alert('Failed to update bank details: ' + error.message);
      })
    );

    // Execute all update operations
    Promise.all(promises)
      .then(() => {
        alert('Profile updated successfully!');
        window.location.reload();
      })
      .catch(error => {
        alert('Failed to update profile: ' + error.message);
      });
  };

  const onSelectFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setImageUrl(URL.createObjectURL(selectedFile));
  };

  return (
    <div>
      <p className='new-invoice-heading'>Profile Settings</p>
      <div className='settings-wrapper'>
        <div className='profile-info update-cName'>
          <img onClick={() => fileInputRef.current.click()} className='profile-img' alt='profile-pic' src={imageUrl} />
          <input onChange={onSelectFile} style={{ display: 'none' }} type="file" ref={fileInputRef} />
        </div>

        <div className='update-cName'>
          <input onChange={(e) => setDisplayName(e.target.value)} type='text' placeholder='Company Name' value={displayName} />
          <input onChange={(e) => setBankName(e.target.value)} type='text' placeholder='Bank Name' value={bankName} />
          <input onChange={(e) => setOwnerName(e.target.value)} type='text' placeholder='Owner Name' value={ownerName} />
          <input onChange={(e) => setAccountNumber(e.target.value)} type='number' placeholder='Account #' value={accountNumber} />

          <button className='update-btn' onClick={handleUpdateAll}>Update All</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
