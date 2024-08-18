const express = require('express');
const router = express.Router();
const ProductsModel = require('../Models/ProductsModel');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST a new product with image upload
router.post('/addproduct', fetchuser, upload.single('image'), [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('isBestSelling').optional().isBoolean().withMessage('Invalid value for isBestSelling'),
    body('isPopular').optional().isBoolean().withMessage('Invalid value for isPopular')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let imageUrl = '';
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
                streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });
            imageUrl = result.secure_url;
        }

        const { title, description, category, price, isBestSelling, isPopular } = req.body;
        const product = new ProductsModel({
            img: imageUrl || '', // Ensure img is set to an empty string if no image is provided
            title,
            description,
            category,
            price,
            isBestSelling,
            isPopular,
            // user: req.user.id
        });

        const newProduct = await product.save();
        res.status(200).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT (update) an existing product by ID
router.put('/update/:id', fetchuser, upload.single('image'), async (req, res) => {
    try {
        let imageUrl = '';
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
                streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });
            imageUrl = result.secure_url;
        }

        const updateData = {
            ...req.body,
            ...(imageUrl ? { img: imageUrl } : {})
        };

        const product = await ProductsModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a product by ID
router.delete('/delete/:id', fetchuser, async (req, res) => {
    try {
        const product = await ProductsModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const result = await ProductsModel.deleteOne({ _id: req.params.id });
        if (result.deletedCount > 0) {
            if (product.img) {
                const publicId = product.img.split('/').pop().split('.')[0];
                try {
                    await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                    console.error('Failed to delete image from Cloudinary:', err);
                }
            }
            res.json({ message: 'Product deleted' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;