import { Customer } from "../models/CustomerModel.js";

export class CustomerController {
    createCustomer = async (req, res) => {
        const { name, phoneNumber } = req.body;

        try {
            const cutomer = new Customer({ name, phoneNumber });
            await cutomer.save();

            res.json({
                icon: 'success',
                msg: 'Cliente creado con éxito.'
            });
        } catch (error) {
            return res.status(500).json({
                icon: 'error',
                error: 'Ocurrió un error al crear el cliente.'
            });
        };
    }

    listCustomer = async (req, res) => {
        const { limit = 10, page = 1, search = '' } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit)
        };

        try {
            let customers = [];
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
            customers = await Customer.paginate(query, options);
            if (!customers) {
                return res.status(204).json({
                    icon: 'error',
                    error: 'No hay clientes para mostrar'
                });
            }

            return res.json({
                msg: 'Clientes listados correctamente',
                icon: 'success',
                data: customers
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Ocurrió un error al listar los clientes',
                icon: 'error'
            });
        }
    }

    updateCustomer = async (req, res) => {
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
                const customer = await Customer.findOne({ name });
                if (customer && customer._id.toString() !== id) {
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

            await Customer.findByIdAndUpdate(id, fieldsUpdateObj);
            res.json({
                msg: 'Se actualizó el cliente.',
                icon: 'success'
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Ocurrió un error al actualizar el cliente',
                icon: 'error'
            });
        }
    }

    async getCustomer(req, res) {
        const customer = await Customer.findById(req.params.id);

        return res.json({
            msg: 'Cliente encontrado',
            icon: 'success',
            data: customer
        });
    };

    deleteCustomer = async (req, res) => {
        const { id } = req.params;
        try {
            await Customer.findByIdAndUpdate(id, { status: false });

            res.json({
                msg: 'Se eliminó el cliente.',
                icon: 'success'
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Ocurrió un error al eliminar el cliente',
                icon: 'error'
            });
        }
    }
}