import company from "../models/company.model.js";
import * as factory from "../controllers/Factory.js"

export const getAllComppanyies = factory.factory.getAll(company)
export const getCompanyById = factory.factory.getOne(company);
export const createCompany = factory.factory.createOne(company);
export const deleteCompany =  factory.factory.deleteOne(company);
export const updateCompany  = factory.factory.updateOne(company);
 
