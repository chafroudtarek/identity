export const authRole = (role) => {
  return (req, res, next) => {
    if (role.includes(req.user.role) ) {
      next();
    } else {
      res.status(401);
      return res.send("Not allowed");
    }
  };
};
