import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* register user */

export const register = async (req, res) => {
    try{
        const{
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation 
        } = req.body;

        const salt = await bcrypt.genSalt();
    }catch(err){

    }
}