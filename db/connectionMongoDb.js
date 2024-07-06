import { connect } from "mongoose";
import { COMPASS_CONNECTION } from "../config.js";

export const connectionDb = async () => {
    try {
        await connect(COMPASS_CONNECTION);
        console.log('db conectada');
    } catch (error) {
        throw new Error(error.message);
    };
};