const { Router } = require("express");

const userRouter = require("./userRoutes");

const router = Router();

router.use("/user", userRouter);

module.exports = router;