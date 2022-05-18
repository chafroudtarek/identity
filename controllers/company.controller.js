import Company from "../models/company.model.js";
import * as factory from "../controllers/Factory.js"

export const getAllComppanyies = factory.factory.getAll(Company)
export const getCompanyById = factory.factory.getOne(Company);
export const createCompany = factory.factory.createOne(Company);
export const deleteCompany =  factory.factory.deleteOne(Company);
export const updateCompany  = factory.factory.updateOne(Company);

export const getByOwner = async(req,res)=>{
    Company.find({_id:req.params.id}).then((CompanyOwner)=>res.status(200).json({response:CompanyOwner})).catch((err) => res.status(400).json(err));
}
 
