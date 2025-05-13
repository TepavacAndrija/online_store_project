import { sql } from "../config/db.js"

export const getAllProducts = async (req ,res) => {
    try {
        const products = await sql`
            SELECT * FROM products
            ORDER BY created_at DESC
        `
        console.log("fetched products: ", products)
        res.status(200).json({succes: true, data: products})
    } catch (error) {
        console.log("get all products error",error)
        res.status(500).json({succes:false, message:"internal server error"})
    }
}
export const createProduct = async  (req,res) => {
    const {name, price, image} = req.body

    if(!name || !price || !image)
    {
        return res.status(400).json({succes:false, message:"all fields required"})
    }

    try {
        const newProduct = await sql`
            INSERT INTO products (name,price,image)
            VALUES (${name},${price},${image})
            RETURNING *
        `
        res.status(201).json({succes: true, data: newProduct[0]})
   
    } catch (error) {
        console.log("createProduct error"+error)
        res.status(500).json({succes:false, message:"internal server error"})
    }
}
export const getProduct = async  (req,res) => {
    const { id } = req.params

    try {
        const product = await sql`
            SELECT * FROM products WHERE id=${id}
        `
        res.status(200).json({succes: true, data: product[0]})
   
    } catch (error) {
        console.log("getProduct error"+error)
        res.status(500).json({succes:false, message:"internal server error"})
    }
}
export const updateProduct = async  (req,res) => {
    const { id } = req.params
    const {name , price, image } = req.body

    try {
        const updatedProduct = await sql`
            UPDATE products
            SET name=${name}, price=${price}, image= ${image}
            WHERE id= ${id}
            RETURNING *
        `
        if(updateProduct.length === 0 )
        {
            res.status(404).json({succes:false, message:"couldnt find product"})
        }
        res.status(200).json({succes: true, data: updatedProduct[0]})
   
    } catch (error) {
        console.log("updateProduct error"+error)
        res.status(500).json({succes:false, message:"internal server error"})
    }
}
export const deleteProduct = async (req,res) => {
    const { id } = req.params

    try {
        const deletedProducts = await sql`
            DELETE FROM products
            WHERE id= ${id}
            RETURNING *
        `
        if(deletedProducts.length === 0 )
        {
            res.status(404).json({succes:false, message:"couldnt find product"})
   
        }
        res.status(200).json({succes: true, data: deletedProducts[0]})

    } catch (error) {
        console.log("deleteProduct error"+error)
        res.status(500).json({succes:false, message:"internal server error"})
    }
}