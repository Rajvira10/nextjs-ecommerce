import Layout from '@/components/Layout'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { withSwal } from "react-sweetalert2";

const Categories = ({swal}) => {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState("");
    const [categories,setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    
    const fetchCategories = () => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }

    
    useEffect(()=>{
        fetchCategories();
    },[])

    const saveCategory = (e) => {
        e.preventDefault()
        setIsSaving(true);
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
        setIsSaving(false);
    }


    const editCategory = (category) => {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id || "")
    }

    const deleteCategory = async(category) => {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            reverseButtons: true,
            confirmButtonColor: '#d55'
        }).then(result => {
            if(result.isConfirmed){
                const {_id} = category;
                axios.delete('/api/categories?_id='+_id);
            }
            fetchCategories();
        })

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
            <button type='submit' disabled={isSaving} className='btn btn-primary py-1 disabled:bg-slate-600 disabled:text-white disabled:border-slate-500'>Save</button>
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
                            <button onClick={()=> deleteCategory(category)}className='btn-primary'>Delete</button>
                        </td>
                    </tr>  
                ))}
            </tbody>
        </table>
        
    </Layout>   
  )
}

export default withSwal(({swal}, ref) => (
    <Categories swal={swal}/>
));

