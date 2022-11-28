import { Router } from "express";
import { body } from "express-validator";
import AuthController from "./../controllers/AuthController";

const AuthRouter = Router();
AuthRouter.post("/registration", body("email").isEmail(), body("password").isLength({ min: 4, max: 64 }), AuthController.registration.bind(AuthController));
AuthRouter.post("/login", AuthController.login.bind(AuthController));
AuthRouter.post("/logout", AuthController.logout.bind(AuthController));
AuthRouter.get("/refresh", AuthController.refresh.bind(AuthController));
// AuthRouter.get("/activate/:link", AuthController.activate.bind(AuthController));

export default AuthRouter;
