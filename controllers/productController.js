import { Product } from "../models/ProductModel.js";
import { Category } from "../models/CategoryModel.js";
import { Supplier } from "../models/SupplierModel.js";

export class ProductController {

    constructor() {
        this.fieldsUpdate = {};
    }

    createProduct = async (req, res) => {
        const {
            name, description,
            purchasePrice, salePrice,
            stock, category, supplier
        } = req.body;

        try {
            const user = req.userAuth._id
            const product = new Product({ name, description, purchasePrice, salePrice, stock, user, supplier, category });
            await product.save();

            res.json({
                icon: 'success',
                msg: 'Producto creado con éxito.'
            });
        } catch (error) {
            return res.status(500).json({
                icon: 'error',
                error: 'Ocurrió un error al crear el producto.'
            });
        }
    }

    listProducts = async (req, res) => {
        const { limit = 10, page = 1, search = '' } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            populate: [
                { path: 'user', select: 'name' },
                { path: 'supplier', select: 'name' },
                { path: 'category', select: 'name' }
            ]
        };

        try {
            let products = [];
            let query = {};
            if (search) {
                query = {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { purchasePrice: !isNaN(search) ? { $eq: search } : null },
                        { salePrice: !isNaN(search) ? { $eq: search } : null },
                        { stock: !isNaN(search) ? { $eq: search } : null }
                    ].filter(cond => cond !== null),
                };

                const categories = await Category.find({ name: { $regex: search, $options: 'i' } }).select('_id');
                if (categories.length > 0) {
                    query.$or.push({ category: { $in: categories.map(category => category._id) } });
                }

                const suppliers = await Supplier.find({ name: { $regex: search, $options: 'i' } }).select('_id');
                if (suppliers.length > 0) {
                    query.$or.push({ supplier: { $in: suppliers.map(supplier => supplier._id) } });
                }
            }
            query.status = true;
            products = await Product.paginate(query, options);
            if (!products) {
                return res.status(204).json({
                    icon: 'error',
                    error: 'No hay productos para mostrar'
                });
            }

            return res.json({
                msg: 'Productos listados correctamente',
                icon: 'success',
                data: products
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Ocurrió un error al listar los productos',
                icon: 'error'
            });
        }
    }

    updateProduct = async (req, res) => {
        const {
            name, description,
            purchasePrice, salePrice,
            stock, category, supplier
        } = req.body;
        const { id } = req.params;

        if (!name && !description && !price && !stock && !category && !supplier) {
            return res.status(400).json({
                icon: 'error',
                error: 'Debe especificar al menos un campo al actualizar'
            });
        }

        if (name) {
            const productSearchByName = await Product.findOne({ name });
            if (productSearchByName && productSearchByName._id.toString() !== id) {
                return res.status(409).json({
                    icon: 'error',
                    error: 'El nombre que intenta guardar, ya está siendo utilizado.'
                });
            }
            this.fieldsUpdate.name = name;
        }

        this.createObjFieldsUpdate('description', description);
        this.createObjFieldsUpdate('purchasePrice', purchasePrice);
        this.createObjFieldsUpdate('salePrice', salePrice);
        this.createObjFieldsUpdate('stock', stock);
        this.createObjFieldsUpdate('supplier', supplier);
        this.createObjFieldsUpdate('category', category);

        try {
            await Product.findByIdAndUpdate(id, this.fieldsUpdate, { new: true });
            return res.json({
                icon: 'success',
                msg: 'Producto actualizado correctamente.',
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Ocurrió un error al actualizar el producto',
                icon: 'error'
            });
        }
    }

    createObjFieldsUpdate = (field, value) => {
        if (value) {
            this.fieldsUpdate[field] = value;
        }
    }

    async getProduct(req, res) {
        const product = await Product.findById(req.params.id).populate('supplier').populate('category');

        return res.json({
            msg: 'Producto encontrado',
            icon: 'success',
            data: product
        });
    };

    deleteProduct = async (req, res) => {
        const { id } = req.params;
        try {
            await Product.findByIdAndUpdate(id, { status: false }, { new: true });
            return res.json({
                msg: 'Producto eliminado correctamente.',
                icon: 'success',
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Ocurrió un error al eliminar el producto.',
                icon: 'error'
            });
        }
    }
}