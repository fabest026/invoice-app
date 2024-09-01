import React from 'react';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const InvoiceDetail = () => {
    const location = useLocation();
    const [data, setData] = useState(location.state);
    console.log(location.state);

    const printInvoice = () => {
        const input = document.getElementById('invoice');
        if (!input) {
            console.error('No element found with the ID "invoice"');
            return;
        }
        html2canvas(input, { useCORS: true })
            .then((canvas) => {
                const imageData = canvas.toDataURL('image/png', 1.0);
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'pt',
                    format: [612, 792],
                });

                pdf.internal.scaleFactor = 1;
                const imageProps = pdf.getImageProperties(imageData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imageProps.height * pdfWidth) / imageProps.width;

                pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('invoice' + new Date());
            })
            .catch((error) => {
                console.error('Error generating PDF:', error);
            });
    };

    return (
        <div>
            <div id="invoice" className="invoice-detail-wrapper">
                <div className="invoice-detail-header">
                    <div className="company-detail">
                        <img className="company-logo" alt="company-logo" src={localStorage.getItem('photoURL')} />
                        <p className="company-info">{localStorage.getItem('cName')}</p>
                        <p>{localStorage.getItem('email')}</p>
                    </div>

                    <div className="customer-detail">
                        <h1>Invoice</h1>
                        {data && (
                            <>
                                <p>Date: {data.invoiceDate}</p>
                                <p>Invoice #: {data.invoiceNumber}</p>
                                <p>Name: {data.clientName}</p>
                                <p>Email: {data.clientEmail}</p>
                                <p>Contact #: {data.clientPhone}</p>
                                <p>Address: {data.clientAddress}</p>
                            </>
                        )}
                    </div>
                </div>

                <table className="invoice-detail-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Items</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.product?.map((product, index) => (
                            <tr key={product.id}>
                                <td>{index + 1}</td>
                                <td>{product.productName}</td>
                                <td>{product.price}</td>
                                <td>{product.quantity}</td>
                                <td>{product.price * product.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'right' }}>
                                Total Amount:
                            </td>
                            <td>{data?.total}</td>
                        </tr>
                    </tfoot>
                </table>

                <div className="company-detail-footer">
                        <p className="company-info">Thank You!</p>
                        <p>Payment Method</p>
                        <p>{localStorage.getItem('bankName')}</p>
                        <p>{localStorage.getItem('ownerName')}</p>
                        <p>{localStorage.getItem('accountNumber')}</p>
                    </div>

            </div>
            <div className="invoice-btn-header">
                <button onClick={printInvoice} className="print-btn">
                    Print Invoice
                </button>
            </div>
        </div>
    );
};

export default InvoiceDetail;
