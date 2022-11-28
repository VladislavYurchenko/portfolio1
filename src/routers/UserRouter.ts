import { Router } from "express";
import { body } from "express-validator";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import UserController from "./../controllers/UserController";

const UserRouter = Router();
UserRouter.get("/user/activate/:activationLink", UserController.activate.bind(UserController));
UserRouter.put("/user/newname", AuthMiddleware, UserController.changeName.bind(UserController));
UserRouter.put("/user/newemail", body("email").isEmail(), AuthMiddleware, UserController.changeEmail.bind(UserController));
UserRouter.put("/user/newpassword", body("newPassword").isLength({ min: 4, max: 64 }), AuthMiddleware, UserController.changePassword.bind(UserController));
UserRouter.post("/user/delete", AuthMiddleware, UserController.deleteAccount.bind(UserController));

export default UserRouter;
