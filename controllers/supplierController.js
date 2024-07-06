import { Supplier } from "../models/SupplierModel.js";

export class SupplierController {
    createSupplier = async (req, res) => {
        const { name, phoneNumber } = req.body;

        try {
            const supplier = new Supplier({ name, phoneNumber });
            await supplier.save();

            res.json({
                icon: 'success',
                msg: 'Proveedor creado con éxito.'
            });
        } catch (error) {
            return res.status(500).json({
                icon: 'error',
                error: 'Ocurrió un error al crear el proveedor.'
            });
        };
    }

    listSuppliers = async (req, res) => {
        const { limit = 10, page = 1, search = '' } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit)
        };

        try {
            let suppliers = [];
            let query = {};
            if (search) {
                query = {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { phoneNumber: !isNaN(search) ? { $eq: search } : null },
                    ].filter(cond => cond !== null),
                };
            }

            query.status = true;
            suppliers = await Supplier.paginate(query, options);
            if (!suppliers) {
                return res.status(204).json({
                    icon: 'error',
                    error: 'No hay proveedores para mostrar'
                });
            }

            return res.json({
                msg: 'Proveedores listados correctamente',
                icon: 'success',
                data: suppliers
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Ocurrió un error al listar los proveedores',
                icon: 'error'
            });
        }
    }

    updateSupplier = async (req, res) => {
        const { name, phoneNumber } = req.body;
        const { id } = req.params;
        if (!name && !phoneNumber) {
            return res.status(400).json({
                icon: 'error',
                error: 'Debe especificar al menos un campo al actualizar'
            });
        }

        try {
            const fieldsUpdateObj = {};
            if (name) {
                const supplier = await Supplier.findOne({ name });
                if (supplier && supplier._id.toString() !== id) {
                    return res.status(400).json({
                        error: 'Nombre ya registrado. Por favor, elija otro.',
                        icon: 'error'
                    });
                }
                fieldsUpdateObj.name = name;
            }

            if (phoneNumber) {
                fieldsUpdateObj.phoneNumber = phoneNumber;
            }

            await Supplier.findByIdAndUpdate(id, fieldsUpdateObj);
            res.json({
                msg: 'Se actualizó el proveedor.',
                icon: 'success'
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Ocurrió un error al actualizar el proveedor',
                icon: 'error'
            });
        }
    }

    async getSupplier(req, res) {
        const supplier = await Supplier.findById(req.params.id);

        return res.json({
            msg: 'Proveedor encontrado',
            icon: 'success',
            data: supplier
        });
    };

    deleteSupplier = async (req, res) => {
        const { id } = req.params;
        try {
            await Supplier.findByIdAndUpdate(id, { status: false });

            res.json({
                msg: 'Se eliminó el proveedor.',
                icon: 'success'
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Ocurrió un error al eliminar el proveedor',
                icon: 'error'
            });
        }
    }
}