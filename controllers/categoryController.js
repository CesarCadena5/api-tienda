import { Category } from "../models/CategoryModel.js";

export class CategoryController {
    async createCategory(req, res) {
        const { name } = req.body;

        try {
            const category = new Category({ name });
            await category.save();

            res.json({
                icon: 'success',
                msg: 'Categoría creada con éxito.'
            });
        } catch (error) {
            return res.status(500).json({
                icon: 'error',
                error: 'Ocurrió un error al crear la categoría.'
            });
        };
    }

    async listCategory(req, res) {
        const { limit = 10, page = 1, search = '' } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit)
        };

        try {
            let categories = [];
            let query = {};
            if (search) {
                query = {
                    $or: [
                        { name: { $regex: search, $options: 'i' } }
                    ].filter(cond => cond !== null),
                };
            }

            query.status = true;
            categories = await Category.paginate(query, options);
            if (!categories) {
                return res.status(204).json({
                    icon: 'error',
                    error: 'No hay categorías para mostrar'
                });
            }

            return res.json({
                msg: 'Categorías listadas correctamente',
                icon: 'success',
                data: categories
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Ocurrió un error al listar las categorías',
                icon: 'error'
            });
        }
    }

    async updateCategory(req, res) {
        const { name } = req.body;
        const { id } = req.params;
        try {
            const category = await Category.findOne({ name });
            if (category && category._id.toString() !== id) {
                return res.status(400).json({
                    error: 'Nombre ya registrado. Por favor, elija otro.',
                    icon: 'error'
                });
            }

            await Category.findByIdAndUpdate(id, { name });
            res.json({
                msg: 'Se actualizó la categoría.',
                icon: 'success'
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Ocurrió un error al actualizar la categoría',
                icon: 'error'
            });
        }
    }

    async getCategory(req, res) {
        const category = await Category.findById(req.params.id);

        return res.json({
            msg: 'Categoría encontrada',
            icon: 'success',
            data: category
        });
    };

    async deleteCategory(req, res) {
        const { id } = req.params;
        try {
            await Category.findByIdAndUpdate(id, { status: false });

            res.json({
                msg: 'Se eliminó la categoría.',
                icon: 'success'
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Ocurrió un error al eliminar la categoría',
                icon: 'error'
            });
        }
    }
}