import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { isAdminRequest } from "./auth/[...nextauth]";


export default async function handle(req,res){
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if(method === "GET"){
        res.json(await Category.find().populate('parent'));
    }

    if(method === "POST"){
        try{
            const {name, parentCategory, properties} = req.body;
            const categoryDoc = await Category.create({
                name, 
                parent: parentCategory || undefined,
                properties: properties
            });
                res.json(categoryDoc);
        }
        catch(err){
            console.log(err);
        }


    }

    if(method === "PUT"){
        const {name,parentCategory,properties, _id} = req.body;
        try{
                const categoryDoc = await Category.updateOne({_id},{
                    name, 
                    parent: parentCategory || undefined,
                    properties: properties || undefined
                });
                res.json(categoryDoc);
        }
        catch(err){
            console.log(err);
        }
    }
    
    if(method === "DELETE"){
        const {_id} = req.query;
        await Category.deleteOne({_id});
        res.json('ok')
    }
}