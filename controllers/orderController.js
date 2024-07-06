import { Types } from "mongoose";
import { Order } from "../models/OrderModel.js";
import { Supplier } from "../models/SupplierModel.js";
import { validateFormatProducts } from "../helpers/validateFormatProducts.js";

export class OrderController {
    create = async (req, res) => {
        const {
            supplier, totalPurchase,
            adittionalNote, statusOrder, products
        } = req.body;

        const { productsValid, productsInvalid } = await validateFormatProducts(products);
        if (productsValid.length === 0) {
            return res.status(422).json({
                icon: 'error',
                error: 'Se requiere al menos un producto que cumpla con la estructura requerida'
            });
        }

        try {
            const order = new Order({ supplier, totalPurchase, adittionalNote, statusOrder, products: productsValid });
            await order.save();

            if (productsInvalid.length > 0 && productsValid.length > 0) {
                return res.json({
                    icon: 'success',
                    msg: 'Sé guardó el pedido, pero hubieron productos que no se pudieron procesar.',
                    dataInvalid: productsInvalid
                });
            }

            return res.json({
                icon: 'success',
                msg: 'Pedido guardado éxitosamente',
            });
        } catch (error) {
            return res.status(500).json({
                icon: 'error',
                error: 'Ocurrió un error al guardar el pedido.'
            });
        }
    }

    update = async (req, res) => {
        const {
            supplier, totalPurchase,
            adittionalNote, statusOrder, products
        } = req.body;
        const { id } = req.params;

        if (!supplier && !totalPurchase && !adittionalNote && !statusOrder && !products) {
            return res.status(400).json({
                icon: 'error',
                error: 'Debe especificar al menos un campo al actualizar'
            });
        }

        const fieldsUpdate = {};
        const statusOrderValids = ['pagada', 'cancelada', 'pendiente'];
        if (supplier && Types.ObjectId.isValid(supplier)) {
            const supplierSearch = await Supplier.findById(supplier);
            if (!supplierSearch || !supplierSearch.status) {
                return res.status(404).json({
                    icon: 'error',
                    error: 'El proveedor especificado no existe'
                });
            }
            fieldsUpdate.supplier = supplier;
        }

        if (totalPurchase) {
            fieldsUpdate.totalPurchase = totalPurchase;
        }

        if (adittionalNote) {
            fieldsUpdate.adittionalNote = adittionalNote;
        }

        if (statusOrder && !statusOrderValids.includes(statusOrder)) {
            return res.status(400).json({
                icon: 'error',
                error: 'El estado de la orden especificada no existe'
            });
        } else {
            fieldsUpdate.statusOrder = statusOrder;
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
            await Order.findByIdAndUpdate(id, fieldsUpdate, { new: true });
            if (productsInvalid.length > 0 && productsValid.length > 0) {
                return res.json({
                    icon: 'success',
                    msg: 'Sé actulizó el pedido, pero hubieron productos que no se pudieron procesar.',
                    dataInvalid: productsInvalid
                });
            }

            return res.json({
                icon: 'success',
                msg: 'Pedido actualizado éxitosamente',
            });
        } catch (error) {
            return res.status(500).json({
                icon: 'error',
                error: 'Ocurrió un error al actualizar el pedido.'
            });
        }
    }

    list = async (req, res) => {
        const { limit = 10, page = 1, search = '' } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            populate: [
                { path: 'supplier', select: 'name' }
            ]
        };

        try {
            let orders = [];
            let query = {};
            if (search) {
                query = {
                    $or: [
                        { statusOrder: { $regex: search, $options: 'i' } },
                        { totalPurchase: !isNaN(search) ? { $eq: search } : null },
                    ].filter(cond => cond !== null),
                };

                const suppliers = await Supplier.find({ name: { $regex: search, $options: 'i' } }).select('_id');
                if (suppliers.length > 0) {
                    query.$or.push({ supplier: { $in: suppliers.map(supplier => supplier._id) } });
                }
            }

            query.status = true;
            orders = await Order.paginate(query, options);
            if (!orders) {
                return res.status(204).json({
                    icon: 'error',
                    error: 'No hay pedidos para mostrar'
                });
            }

            return res.json({
                msg: 'Pedidos listados correctamente',
                icon: 'success',
                data: orders
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error: 'Ocurrió un error al listar los pedidos',
                icon: 'error'
            });
        }
    }

    getOrder = async (req, res) => {
        const order = await Order.findById(req.params.id).populate('supplier');

        return res.json({
            msg: 'Pedido encontrado',
            icon: 'success',
            data: order
        });
    };

    deleteOrder = async (req, res) => {
        const { id } = req.params;
        try {
            await Order.findByIdAndUpdate(id, { status: false }, { new: true });
            return res.json({
                msg: 'Pedido eliminado correctamente.',
                icon: 'success',
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Ocurrió un error al eliminar el pedido.',
                icon: 'error'
            });
        }
    }
}