import React from 'react'
import '../../component/dashboard/dashboard.css'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'
import { signOut } from 'firebase/auth'
import 'remixicon/fonts/remixicon.css'


const Dashboard = () => {
    const navigate = useNavigate()
    const logOut = () => {
        signOut(auth).then(() => {
            localStorage.clear()
            navigate('/login')

        }).catch((error) => {
            console.log(error)
        });
    }
    return (
        <div className='dashboard-wrapper'>
            <div className='side-nav'>
                <div className='profile-info'>
                    {/* <img alt='company-logo' src={require('../../assests/appjingle.png')}/>
                    <div>
                        <p>AppJingle Solutions</p>
                        <button onClick={logOut}>Logout</button>
                    </div> */}

                    <img src={localStorage.getItem('photoURL')} />
                    <div>
                        <p>{localStorage.getItem('cName')}</p>
                        <button onClick={logOut}>Logout</button>
                    </div>

                </div>
                <hr />
                <div className='menu'>
                    <Link to='/dashboard/home' className='menu-link'><i className="ri-home-office-line"></i> Home</Link>
                    <Link to='/dashboard/new-invoice' className='menu-link'><i className="ri-store-3-line"></i> New Invoice</Link>
                    <Link to='/dashboard/invoices' className='menu-link'><i className="ri-currency-line"></i> Invoices</Link>
                    <Link to='/dashboard/settings' className='menu-link'><i className="ri-user-settings-line"></i> Settings</Link>
                </div>


            </div>

            <div className='dashboard-container'>
                <Outlet />

            </div>

        </div>
    )
}

export default Dashboard