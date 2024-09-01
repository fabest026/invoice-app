import React from 'react'
import { useState } from 'react'
import { db } from '../../firebase'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const NewInvoice = () => {
    const [invoiceDate, setInvoiceDate] = useState('')
    const [invoiceNumber, setInvoiceNumber] = useState('')
    const [clientName, setClientName] = useState('')
    const [clientEmail, setClientEmail] = useState('')
    const [clientPhone, setClientPhone] = useState('')
    const [clientAddress, setClientAddress] = useState('')
    const [productName, setProductName] = useState('')
    const [price, setPrice] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(false)


    const [product, setProduct] = useState([])

    const navigation = useNavigate()

    const addProduct = () => {
        setProduct([...product, {
            id: product.length + 1,
            productName: productName,
            price: price,
            quantity: quantity
        }])

        const t = quantity * price
        setTotal(total + t)

        setProductName('')
        setPrice('')
        setQuantity(1)

    }


    const saveData = async () => {
        setIsLoading(true)
        console.log(invoiceDate, invoiceNumber, clientName, clientEmail, clientPhone, clientAddress)
        console.log(product)
        console.log(total)
        const data = await addDoc(collection(db, 'invoices'), {
            invoiceDate: invoiceDate,
            invoiceNumber: invoiceNumber,
            clientName: clientName,
            clientEmail: clientEmail,
            clientPhone: clientPhone,
            clientAddress: clientAddress,
            product: product,
            total: total,
            uid: localStorage.getItem('uid'),
            date: Timestamp.fromDate(new Date())
        })
        console.log(data)

        navigation('/dashboard/invoices')
        setIsLoading(false)


    }



    return (

        <div>
            <p className='new-invoice-heading'>New Invoice</p>

            <form className='new-invoice-form'>
                <div className='new-invoice-form-inputs'>
                    <input onChange={(e) => { setInvoiceDate(e.target.value) }} type="date" placeholder='Invoice Date' value={invoiceDate} />
                    <input onChange={(e) => { setInvoiceNumber(e.target.value) }} type="number" placeholder='Invoice Number' value={invoiceNumber} />
                    <input onChange={(e) => { setClientName(e.target.value) }} type="text" placeholder='Client Name' value={clientName} />
                    <input onChange={(e) => { setClientEmail(e.target.value) }} type="text" placeholder='Client Email' value={clientEmail} />
                    <input onChange={(e) => { setClientPhone(e.target.value) }} type="number" placeholder='Client Phone' value={clientPhone} />
                    <input onChange={(e) => { setClientAddress(e.target.value) }} type="text" placeholder='Client Address' value={clientAddress} />
                </div>

                <div className='new-invoice-form-inputs'>
                    <input onChange={(e) => { setProductName(e.target.value) }} type="text" placeholder='Product Name' value={productName} />
                    <input onChange={(e) => { setPrice(e.target.value) }} type="number" placeholder='Price' value={price} />
                    <input onChange={(e) => { setQuantity(e.target.value) }} type="number" placeholder='Quantity' value={quantity} />
                </div>

                <button onClick={addProduct} className='new-product-btn' type='button'>Add Product</button>


            </form>




            {product.length > 0 && <div className='product-wrapper'>

                <div className='product-container'>
                    <p>S. No</p>
                    <p>Product Name</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                </div>



                {
                    product.map((data, index) => (
                        <div className='product-container' key={index}>
                            <p>{data.id}</p>
                            <p>{data.productName}</p>
                            <p>{data.price}</p>
                            <p>{data.quantity}</p>
                            <p>{data.price * data.quantity}</p>
                        </div>
                    ))
                }

                <div className='product-total'>
                    <p>Total Amount : {total}</p>
                </div>

            </div>}

            {/* {product.length > 0 && <div className='bottom-btn'>
                <button onClick={saveData} className='header-btn'><i className="fa-solid fa-spinner fa-spin"></i>Save</button>
            </div>} */}

            {product.length > 0 && (
                <div className='bottom-btn'>
                    <button onClick={saveData} className='header-btn'>
                        {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : null} Save
                    </button>
                </div>
            )}







        </div>
    )
}

export default NewInvoice
