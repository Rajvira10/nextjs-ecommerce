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
    const [properties, setProperties] = useState([]);

    
    const fetchCategories = () => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }

    const addProperty = () => {
        setProperties(prev => {
            return[...prev,{name:'', values: ''}]
        })
    }

    const handlePropertyNameChange = (index,property,newName) => {
        setProperties(prev => {
            const newProperties = [...prev];
            newProperties[index].name = newName
            return newProperties;
        })
    }

    const handlePropertyValuesChange = (index,property,newValues) => {
        setProperties(prev => {
            const newProperties = [...prev];
            newProperties[index].values = newValues
            return newProperties;
        })
    }

    const removeProperty = (index) =>{
        setProperties(prev => {
            return [...prev].filter((p,pIndex)=> {
                return pIndex !== index;
            })
        })
    }
    
    useEffect(()=>{
        fetchCategories();
    },[])

    const saveCategory = (e) => {
        e.preventDefault()
        setIsSaving(true);
        const data = {name,parentCategory, properties:properties.map(p => ({
            name: p.name, values: p.values.split(','),
        }))}
        if(editedCategory){
            data._id = editedCategory._id;
            axios.put(`/api/categories`,data);
            setEditedCategory(null);
        }else{
            axios.post('/api/categories',data);
        }
        setName("");
        setParentCategory("");
        setProperties([]);
        fetchCategories();
        setIsSaving(false);
    }


    const editCategory = (category) => {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id || "")
        setProperties(category.properties?.map((p)=>({
            name: p.name,
            values: p.values?.join(',')
        })));
        const hello = category.properties?.map((p)=>({
            name: p.name,
            values: p.values?.join(',')
        }))
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
        <form onSubmit={saveCategory}>
            <div className='flex gap-1'>
            <input value={name} onChange={(e)=>setName(e.target.value)}  type="text" placeholder={'Category name'} />
            <select value={parentCategory} onChange={(e)=> setParentCategory(e.target.value)}>
                <option value="0">No parent category</option>
                {categories.length > 0 && categories.map(category =>(
                    <option key={category._id} value={category._id}>
                        {category.name}
                    </option>  
                ))}
            </select>
            </div>
            <div className='mb-2'>
                <label className='block'>Properties</label>
                <button type='button' onClick={addProperty} className="btn-default text-sm mb-2">Add new property</button>
                {properties?.length>0 && properties?.map((property,index) => (
                    <div className="flex gap-1" key={index}>
                        <input type="text" value={property.name}
                        className='mb-0'
                        onChange={(e)=>handlePropertyNameChange(index,property,e.target.value)} placeholder='property name (example: color)'/>
                        <input type="text" className='mb-0' onChange={e => handlePropertyValuesChange(index,property,e.target.value)}value={property.values}placeholder='values, comma separated' />
                        <button type='button' onClick={()=>removeProperty(index)} className="btn-default">Remove</button>
                    </div>
                ))}
            </div>
            <div className='flex gap-1'>
            {editedCategory && (
                <button onClick={() => {
                    setEditedCategory(null);
                    setName(""); 
                    setParentCategory("");
                    setProperties([]);
                }}
                className='btn-default'>Cancel</button>  
            )}
            <button type='submit' disabled={isSaving} className='btn btn-primary py-1 disabled:bg-slate-600 disabled:text-white disabled:border-slate-500'>Save</button>
            </div> 
           
        </form>
        {!editedCategory && (<table className="basic mt-4">
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
        </table>)}

        
    </Layout>   
  )
}

export default withSwal(({swal}, ref) => (
    <Categories swal={swal}/>
));

