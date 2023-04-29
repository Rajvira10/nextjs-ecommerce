import Layout from '@/components/Layout'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Categories = () => {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState("");
    const [categories,setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState(' ');

    
    const fetchCategories = () => {
        console.log("hello");
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
        console.log("hello");
    }

    
    useEffect(()=>{
        fetchCategories();
    },[])

    const saveCategory = (e) => {
        e.preventDefault()
        const data = {name,parentCategory}
        if(editedCategory){
            data._id = editedCategory._id;
            axios.put(`/api/categories`,data);
            setEditedCategory(null);
        }else{
            axios.post('/api/categories',data);
        }
        setName("");
        setParentCategory("")
        fetchCategories();
    }


    const editCategory = (category) => {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id || "")
    }

  return (
    <Layout>
        <h1>Categories</h1>
        <label>{editedCategory? `Edit Category ${editedCategory.name}`:"Create New Category"}</label>
        <form onSubmit={saveCategory} className="flex gap-1">
            <input value={name} onChange={(e)=>setName(e.target.value)} className='mb-0' type="text" placeholder={'Category name'} />
            <select value={parentCategory} onChange={(e)=> setParentCategory(e.target.value)} className='mb-0'>
                <option value="0">No parent category</option>
                {categories.length > 0 && categories.map(category =>(
                    <option key={category._id} value={category._id}>
                        {category.name}
                    </option>  
                ))}
            </select>
            <button type='submit' className='btn btn-primary py-1'>Save</button>
        </form>
        <table className="basic mt-4">
            <thead>
                <tr>
                    <td>Category Name</td>
                    <td>Parent Category</td>
                    <td>Actions</td>
                </tr>
            </thead>
            <tbody>
                {categories.length > 0 && categories.map(category =>(
                    <tr key={category._id}>
                        <td>{category.name}</td>
                        <td>{category.parent?.name}</td>
                        <td>
                            <button onClick={()=> editCategory(category)} className='btn-primary mr-1'>Edit</button>
                            <button className='btn-primary'>Delete</button>
                        </td>
                    </tr>  
                ))}
            </tbody>
        </table>
        
    </Layout>   
  )
}

export default Categories