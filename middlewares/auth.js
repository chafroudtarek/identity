import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import {mylogger} from '../utils/winstonn.js'

dotenv.config();





 const permit =  (...permittedRoles) => {
   
    return (req, res, next) => {
        try {
            mylogger.info("*** MIDDLEWARE verifyToken ***");
            if (!req.headers.authorization) return res.sendStatus(401)
            const accessToken = req.headers.authorization.split(' ')[1];
            if (accessToken == null || !accessToken) return res.sendStatus(401)
            jwt.verify(accessToken, process.env.JWT_SECRET,  (err, user) => {
                mylogger.info(user);
                if (err) return res.status(401).json(err);
                mylogger.info("permittedRoles : ", permittedRoles);
               
                User
                    .findById(user._id).select('accessToken')
                    .then((userDoc) => {
                        if (!userDoc || userDoc.accessToken != accessToken)
                            return res.status(401).json({ message: "Veuillez vous reconnecter." })
                        if (permittedRoles && permittedRoles.length) {
                            if (user && permittedRoles.includes(user.type)) {
                                // mylogger.info("user :", user);
                                req.user = user;
                                next();
                            } else {
                                res.status(403).json({ message: "Forbidden" }); // user is forbidden
                            }
                        } else {
                            // mylogger.info("user :", user);
                            req.user = user;
                            next();
                        }
                    })
                    .catch((err) => res.status(404).json(err));

            })
        } catch {
            res.status(400).json({
                error: new Error('Invalid request!')
            });
        }
    };
}


export default permit;
