import Layout from '@/components/Layout'
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react'

const NewProduct = () => {
    const router = useRouter()
    const [goToProducts, setGoToProducts] = useState(false) 
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('')
    const createProduct = async(e) => {
        e.preventDefault()
        const data = {title,description,price};
        await axios.post('/api/products',data);
        setGoToProducts(true);
    }

    if(goToProducts){
      router.push('/products')
    }
  return (
    <Layout>
        <form onSubmit={createProduct}>
        <h1>New Product</h1>
        <label>Product Name</label>
        <input type="text" name="" id="" placeholder='Product Name' value={title} onChange={(e)=>setTitle(e.target.value)}/>
        <label>Description</label>
        <textarea placeholder='Description' value={description} onChange={(e)=>setDescription(e.target.value)} > </textarea>
        <label>Price (in BDT)</label>
        <input type="text" placeholder='Price' value={price} onChange={(e)=>setPrice(e.target.value)}/>
        <button type='submit' className="btn-primary">Save</button>
        </form>
    </Layout>
  )
}

export default NewProduct