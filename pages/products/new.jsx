import Layout from '@/components/Layout'
import React from 'react'

const NewProduct = () => {
  return (
    <Layout>
        <h1>New Product</h1>
        <label>Product Name</label>
        <input type="text" name="" id="" placeholder='Product Name' />
        <label>Description</label>
        <textarea placeholder='Description'></textarea>
        <label>Price (in BDT)</label>
        <input type="text" placeholder='Price' />
        <button className="btn-primary">Save</button>
    </Layout>
  )
}

export default NewProduct