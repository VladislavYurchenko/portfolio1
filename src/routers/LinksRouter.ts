import { Router } from "express";
import ImagesUploadMiddleware from "../middlewares/ImagesUploadMiddleware";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import LinksController from "./../controllers/LinksController";

const LinksRouter = Router();

LinksRouter.post("/links", AuthMiddleware, LinksController.addLink);
LinksRouter.get("/links", AuthMiddleware, LinksController.getLinks.bind(LinksController));
LinksRouter.get("/links/preload", AuthMiddleware, LinksController.preoloadLinks.bind(LinksController));
LinksRouter.post("/links/:id", AuthMiddleware, LinksController.deleteLink);
LinksRouter.put("/links", AuthMiddleware, ImagesUploadMiddleware.fields([{ name: "files" }]), LinksController.updateLink);

export default LinksRouter;
