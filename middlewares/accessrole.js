export const authRole = (role) => {
  return (req, res, next) => {
    if (role.includes(req.user.role)) {
      req.user.enabled == false
        ? res.send({ message: req.t("ERROR.DEACTIVATED") })
        : next();
    } else {
      res.status(401);
      return res.send({ message: req.t("ERROR.AUTH.WRONG_ROLE") });
    }
  };
};
