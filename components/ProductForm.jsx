import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Spinner from './Spinner';
import { ReactSortable } from 'react-sortablejs';

const ProductForm = ({_id,title:existingTitle, description:existingDescription, price:existingPrice, images:existingImages}) => {
    const router = useRouter()
    const [goToProducts, setGoToProducts] = useState(false) 
    const [title, setTitle] = useState(existingTitle||'');
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState(existingDescription||'');
    const [price, setPrice] = useState(existingPrice||'')
    const [images, setImages] = useState(existingImages||[]);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    useEffect(()=>{
        axios.get("/api/categories").then(result=> {
            setCategories(result.data);
        })
    })
 

    const saveProduct = async(e) => {
        const data = {title,description,price,images,category};
        e.preventDefault()
        if(_id){
            await axios.put('/api/products',{...data,_id});
        }
        else{
            const data = {title,description,price};
            await axios.post('/api/products',data);
        }
        setGoToProducts(true);
    }
    
    if(goToProducts){
        router.push('/products')
    }

    const uploadImages = async(e) => {
        const files = e.target?.files;
        if(files?.length>0){
            setIsUploading(true);
            const data = new FormData();
            for (const file of files){
                data.append('file',file);
            }
            const res = await axios.post('/api/upload',data)
            setImages(oldImages =>{
                return[...oldImages, ...res.data.links];
            })
            setIsUploading(false);
        }
    }

    const updateImagesOrder = () => {
        console.log(arguments)
    }
    if(images === null){
        return;
    }
  return (
    <form onSubmit={saveProduct}>
        <label>Product Name</label>
        <input type="text" name="" id="" placeholder='Product Name' value={title} onChange={(e)=>setTitle(e.target.value)}/>
        <label>Category</label>
        <select value={category} onChange={e=> setCategory(e.target.value)}>
            <option value="">Uncategorized</option>
            {categories.length>0 && categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
            ))}
        </select>
        <label>Photos</label>
        <div className='mb-2 flex flex-wrap gap-1'>
            {console.log(existingImages)}
            {images?.length>0 && images.map(link => (
                <div key={link} className='h-24'>
                    <img src={link} alt="" className='rounded-lg'/>
                </div>
            ))}
            {isUploading && (
                <div className='h-24 flex  items-center'>
                    <Spinner/>
                </div> 
            )}
            <label className='w-24 h-24 border text-center flex text-sm gap-1 text-gray-500 items-center justify-center rounded-lg bg-gray-200 cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>


               <div> Upload</div>
               <input type="file" className='hidden' onChange={uploadImages}/>
            </label>
        </div>
        <label>Description</label>
        <textarea placeholder='Description' value={description} onChange={(e)=>setDescription(e.target.value)} > </textarea>
        <label>Price (in BDT)</label>
        <input type="text" placeholder='Price' value={price} onChange={(e)=>setPrice(e.target.value)}/>
        <button type='submit' className="btn-primary">Save</button>
    </form>
  )
}

export default ProductForm