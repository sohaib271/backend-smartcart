const { getUser } = require("../service/user");
const { decode } = require("jsonwebtoken");

async function restrictToUserOnly(req, res, next) {
  const tokenFromUser = req.headers["authorization"];
  if (!tokenFromUser) return res.json({ error: "No user Found" });

  const extractToken = tokenFromUser.split(" ")[1];
  if (!extractToken)
    return res.status(401).json({ message: "No token provided" });

  try {
    const user = await getUser(extractToken);
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = decode(extractToken);
    next();
  } catch (error) {
    return res
      .json({ message: "Internal server error", error: error.message });
  }
}

module.exports = restrictToUserOnly;
