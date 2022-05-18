import { Router } from "express";
import * as companyController from "../controllers/company.controller.js"

const router = Router();

router.get('/getCompanies',companyController.getAllComppanyies);
router.get('/getCompanybyId/:id',companyController.getCompanyById);
router.post('/addCompany',companyController.createCompany);
router.delete('/deleteCampany/:id',companyController.deleteCompany);
router.put('/editCompany/:id', companyController.updateCompany);

router.get('/companybyowner/:id', companyController.getByOwner);




export default router;