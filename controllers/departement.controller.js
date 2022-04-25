import Departement from "../models/departement.model.js";
import * as factory from "../controllers/Factory.js"
import Mongoose from "mongoose";

export const getAllDepartements = factory.factory.getAll(Departement)
export const getDepartementById = factory.factory.getOne(Departement);
export const createDepartement = factory.factory.createOne(Departement);
export const deleteDepartement =  factory.factory.deleteOne(Departement);
export const updateDepartement  = factory.factory.updateOne(Departement);

export const addCompanyToDepartement = async(req,res)=>{
    req.params.company=Mongoose.Types.ObjectId
    const departement = await Departement.findById(req.params._id)
    departement.company=req.params.company
    departement.save()
    
}


