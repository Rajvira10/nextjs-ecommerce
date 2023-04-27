import Layout from '@/components/Layout'
import axios from 'axios';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const DeleteProductPage = () => {
  const router = useRouter();
  const [productInfo,setProductInfo] = useState();
  const {id} = router.query;
  useEffect(()=>{
    if(!id){
        return;
    }
    axios.get('/api/products?id='+id).then(response => {
        setProductInfo(response.data);
    });
  },[id]);

  const deleteProduct = async() => {
    await axios.delete('/api/products?id='+id)
    goBack();
  }
  
  const goBack = () => {
    router.push('/products');
  }
  return (
    <Layout>
        <h1>Do you really want to delete product &nbsp; &quot;{productInfo?.title}&quot;?</h1> 
        <div className="flex gap-2 justify-center">
          <button onClick={deleteProduct} className='btn-red'>Yes</button>
          <button className='btn-default' onClick={goBack}>No</button>
        </div>

    </Layout>
  )
}

export default DeleteProductPage;