import { Router } from "express";
import * as departementController from "../controllers/departement.controller.js"

const router = Router();


router.get('/getDepartements',departementController.getAllDepartements);
router.get('/getDepartementbyId/:id',departementController.getDepartementById);
router.post('/addDepartement',departementController.createDepartement);
router.delete('/deleteDepartement/:id',departementController.deleteDepartement);
router.put('/editDepartement/:id', departementController.updateDepartement);
router.post('/addCompanyToDepartement/:dep/:company', departementController.addCompanyToDepartement);




export default router;