import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";


dotenv.config();





 const permit =  (...permittedRoles) => {
   
    return (req, res, next) => {
        try {
            console.log("*** MIDDLEWARE verifyToken ***");
            if (!req.headers.authorization) return res.sendStatus(401)
            const accessToken = req.headers.authorization.split(' ')[1];
            if (accessToken == null || !accessToken) return res.sendStatus(401)
            jwt.verify(accessToken, process.env.JWT_SECRET,  (err, user) => {
                console.log(user);
                if (err) return res.status(401).json(err);
                console.log("permittedRoles : ", permittedRoles);
               
                User
                    .findById(user._id).select('accessToken')
                    .then((userDoc) => {
                        if (!userDoc || userDoc.accessToken != accessToken)
                            return res.status(401).json({ message: "Veuillez vous reconnecter." })
                        if (permittedRoles && permittedRoles.length) {
                            if (user && permittedRoles.includes(user.type)) {
                                // console.log("user :", user);
                                req.user = user;
                                next();
                            } else {
                                res.status(403).json({ message: "Forbidden" }); // user is forbidden
                            }
                        } else {
                            // console.log("user :", user);
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
