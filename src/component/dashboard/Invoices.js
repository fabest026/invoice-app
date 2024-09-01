import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    console.log('Fetching data...');
    setIsLoading(true);
    try {
      const q = query(collection(db, 'invoices'), where('uid', '==', localStorage.getItem('uid')));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching data: ', error);
      window.alert('Error fetching invoices.');
    } finally {
      console.log('Finished fetching data.');
      setIsLoading(false);
    }
  };

  const deleteInvoice = async (id) => {
    const isSure = window.confirm('Are you sure?');
    if (isSure) {
      try {
        await deleteDoc(doc(db, 'invoices', id));
        getData(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting invoice: ', error);
        window.alert('Something went wrong while deleting the invoice.');
      }
    }
  };

  return (
    <div>
      <div className='invoices-heading'>
        <p className='new-invoice-heading'>Invoices</p>
      </div>
      {isLoading ? (
        <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
          <i style={{ fontSize: 50 }} className="fa-solid fa-spinner fa-spin"></i>
        </div>
      ) :
        (
          invoices.map((data) => (
            <div className='invoices-box' key={data.id}>
              <p>{data.invoiceDate}</p>
              <p>{data.clientName}</p>
              <p>{data.clientEmail}</p>
              <p>{data.clientPhone}</p>
              <p>Rs. {data.total}</p>
              <button onClick={() => deleteInvoice(data.id)} className='delete-btn'>Delete</button>
              <button
                onClick={() => {
                  navigate('/dashboard/invoice-detail', { state: data });
                }}
                className='view-btn'
              >
                View
              </button>
            </div>
          ))
        )}

        {
          invoices.length < 1 && <div className='no-invoices-box'>
            <p>No invoices found</p>
            <button className='add-btn' onClick={() => navigate('/dashboard/new-invoice')}>Add new invoice</button>
          </div>
        }

      
    </div>
  );
};

export default Invoices;
