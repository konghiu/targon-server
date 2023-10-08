import { folderPublic } from "../../index.js";
import multer from "../config/multer/index.js";
import Product from "../models/Product.js";
import fs from "fs";

const productController = {
    // [GET] show all product
    GetAllProducts: async (req, res) => {
        const { min, max, name, price, sortBy, sortType, classify } = req.query;
        let { page } = req.query;
        // Each time a user queries the store, they only get 6 items
        if (page < 1) {
            res.status(404).json([]);
        } else {
            const limit = 6;
            const query = {
                $and: [
                    {
                        $or: [
                            {
                                price: {
                                    $gte: Number(min) || 0,
                                    $lte: Number(max) || Infinity,
                                },
                            },
                            {
                                price: { $eq: Number(price) || 0 },
                            },
                        ],
                    },
                ],
            };
            // check name if it exists
            if (name) {
                query.$and.push({ name: { $regex: name, $options: "i" } });
            }
            if (classify) {
                query.$and.push({ classify: classify });
            }

            const sort = {};
            if (sortType && sortBy && Math.abs(sortType) === 1) {
                sort[sortBy] = sortType;
            } else {
                sort["createdAt"] = -1;
            }

            let products = await Product.find(query).sort(sort);
            const queryCount = products.length;
            const pageCount = Math.ceil(queryCount / limit);

            // the number of page compare with the total pages available
            if (page > pageCount) page = 1;
            const point = page - 1;
            products = products.slice(point * limit, point * limit + limit);
            res.status(200).json({
                products: products,
                pages: pageCount,
            });
        }
    },

    // [GET] layout insert a new product
    GetInsert: (req, res) => {
        res.render("insert");
    },
    // [POST] handles inserting a new product into the store
    PostInsert: async (req, res) => {
        const { name, price } = req.body;
        const image = req.file?.originalname;
        try {
            const findProduct = await Product.findOne({ name: name });
            if (findProduct) {
                fs.unlink(`${folderPublic}/images/${image}`, (err) => {
                    if (err) console.log(err);
                });
                res.status(201).json({ message: "Item's name already exist" });
            } else {
                const newProduct = new Product({
                    name: name,
                    price: price,
                    image: image,
                });
                await newProduct.save();
                res.status(200).json({ message: "successfully" });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // [PUT] update a product from the store
    PutUpgrade: async (req, res) => {
        const { id } = req.params;
        const { name, price } = req.body;
        const filename = req.file?.originalname;
        const update = {};
        if (name) update["name"] = name;
        else if (price) update["price"] = price;
        else if (filename) update["image"] = filename;

        if (Object.keys(update).length === 0) {
            res.status(400).json({ message: "No data provided" });
        } else {
            try {
                const item = await Product.findByIdAndUpdate(id, update);
                if (filename) {
                    fs.unlink(`${folderPublic}/images/${item.image}`, (err) => {
                        if (err) res.status(500).json({ message: err.message });
                        else res.status(200).json({ message: "Successfully" });
                    });
                } else res.status(200).json({ message: "Successfully" });
            } catch (err) {
                res.status(404).json({ message: "product not available" });
            }
        }
    },

    // [DELETE] delete a product from the store
    DeleteProduct: async (req, res) => {
        const { id } = req.params;
        try {
            const product = await Product.findByIdAndDelete(id);
            if (product) {
                fs.unlink(`${folderPublic}/images/${product.image}`, (err) => {
                    if (err) console.log(err);
                });
                res.status(200).json({ message: "successfully" });
            } else {
                res.status(404).json({ message: "product not available" });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
};

export default productController;
