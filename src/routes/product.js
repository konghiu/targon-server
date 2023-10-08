import express from "express";
import multer from "../config/multer/index.js";
import productController from "../controllers/productController.js";
const productRoutes = express.Router();

productRoutes.get("/", productController.GetAllProducts);
productRoutes.get("/insert", productController.GetInsert);
productRoutes.post(
    "/insert",
    multer.single("image"),
    productController.PostInsert
);
productRoutes.put("/:id", multer.single("image"), productController.PutUpgrade);
productRoutes.delete("/:id", productController.DeleteProduct);

export default productRoutes;
