import { Types } from "mongoose";
import { Sale } from "../models/SalesModel.js";
import { Customer } from "../models/CustomerModel.js";
import { validateFormatProducts } from "../helpers/validateFormatProducts.js";

export class SaleController {
    create = async (req, res) => {
        const {
            customer, totalSale, additionalNote,
            statusSale, products
        } = req.body;

        const { productsValid, productsInvalid } = await validateFormatProducts(products);
        if (productsValid.length === 0) {
            return res.status(422).json({
                icon: 'error',
                error: 'Se requiere al menos un producto que cumpla con la estructura requerida'
            });
        }

        try {
            console.log(additionalNote)
            const sale = new Sale({ customer, totalSale, statusSale, additionalNote, products: productsValid });
            await sale.save();

            if (productsInvalid.length > 0 && productsValid.length > 0) {
                return res.json({
                    icon: 'success',
                    msg: 'Sé guardó la venta, pero hubieron productos que no se pudieron procesar.',
                    dataInvalid: productsInvalid
                });
            }

            return res.json({
                icon: 'success',
                msg: 'Venta guardada éxitosamente',
            });
        } catch (error) {
            return res.status(500).json({
                icon: 'error',
                error: 'Ocurrió un error al guardar la venta.'
            });
        }
    }

    update = async (req, res) => {
        const {
            customer, totalSale, additionalNote,
            statusSale, products
        } = req.body;
        const { id } = req.params;

        if (!customer && !totalSale && !additionalNote && !statusSale && !products) {
            return res.status(400).json({
                icon: 'error',
                error: 'Debe especificar al menos un campo al actualizar'
            });
        }

        const fieldsUpdate = {};
        const statusSaleValids = ['pagada', 'cancelada', 'pendiente'];
        if (customer && Types.ObjectId.isValid(customer)) {
            const customerSearch = await Customer.findById(customer);
            if (!customerSearch || !customerSearch.status) {
                return res.status(404).json({
                    icon: 'error',
                    error: 'El cliente especificado no existe'
                });
            }
            fieldsUpdate.customer = customer;
        }

        if (totalSale) {
            fieldsUpdate.totalSale = totalSale;
        }

        if (additionalNote) {
            fieldsUpdate.additionalNote = additionalNote;
        }

        if (statusSale && !statusSaleValids.includes(statusSale)) {
            return res.status(400).json({
                icon: 'error',
                error: 'El estado de la venta especificada no existe'
            });
        } else {
            fieldsUpdate.statusSale = statusSale;
        }

        const { productsValid, productsInvalid } = await validateFormatProducts(products);
        if (productsValid.length === 0) {
            return res.status(422).json({
                icon: 'error',
                error: 'Se requiere al menos un producto que cumpla con la estructura requerida'
            });
        }

        fieldsUpdate.products = productsValid;
        try {
            await Sale.findByIdAndUpdate(id, fieldsUpdate, { new: true });
            if (productsInvalid.length > 0 && productsValid.length > 0) {
                return res.json({
                    icon: 'success',
                    msg: 'Sé actulizó la venta, pero hubieron productos que no se pudieron procesar.',
                    dataInvalid: productsInvalid
                });
            }

            return res.json({
                icon: 'success',
                msg: 'Venta actualizada éxitosamente',
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                icon: 'error',
                error: 'Ocurrió un error al actualizar la venta.'
            });
        }
    }

    list = async (req, res) => {
        const { limit = 10, page = 1, search = '' } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            populate: [
                { path: 'customer', select: 'name' }
            ]
        };

        try {
            let sales = [];
            let query = {};
            if (search) {
                query = {
                    $or: [
                        { statusSale: { $regex: search, $options: 'i' } },
                        { totalSale: !isNaN(search) ? { $eq: search } : null },
                    ].filter(cond => cond !== null),
                };

                const customers = await Customer.find({ name: { $regex: search, $options: 'i' } }).select('_id');
                if (customers.length > 0) {
                    query.$or.push({ customer: { $in: customers.map(customer => customer._id) } });
                }
            }
            query.status = true;
            sales = await Sale.paginate(query, options);
            if (!sales) {
                return res.status(204).json({
                    icon: 'error',
                    error: 'No hay ventas para mostrar'
                });
            }

            return res.json({
                msg: 'Ventas listadas correctamente',
                icon: 'success',
                data: sales
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Ocurrió un error al listar las ventas',
                icon: 'error'
            });
        }
    }

    getSale = async (req, res) => {
        const sale = await Sale.findById(req.params.id).populate('customer');

        return res.json({
            msg: 'Venta encontrada',
            icon: 'success',
            data: sale
        });
    };

    delete = async (req, res) => {
        const { id } = req.params;
        try {
            await Sale.findByIdAndUpdate(id, { status: false }, { new: true });
            return res.json({
                msg: 'Venta eliminada correctamente.',
                icon: 'success',
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Ocurrió un error al eliminar la venta.',
                icon: 'error'
            });
        }
    }
}