import LinksService from "../services/LinksServis";
import { Request, Response, NextFunction } from "express";
import { reqUser } from "../types/dataTypes/User";
import { ServerResponce } from "../types/dataTypes/ServerResponce";

class LinksController {
  static async getLinks(req: Request & reqUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.user.id;
      const links = await LinksService.getLinks(id);
      res.send(new ServerResponce(true, "", links));
    } catch (error) {
      next(error);
    }
  }

  static async preoloadLinks(req: Request & reqUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.user.id;
      const links = await LinksService.getLinksCount(id);
      res.send(new ServerResponce(true, "", links));
    } catch (error) {
      next(error);
    }
  }

  static async addLink(req: Request & reqUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.user.id;
      const { name, url } = req.body;
      const link = await LinksService.addLink(id, name, url);
      res.send(new ServerResponce(true, "", link));
    } catch (error) {
      next(error);
    }
  }

  static async deleteLink(req: Request & reqUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const stat = await LinksService.deleteLink(id);
      res.send(new ServerResponce(true, "", stat));
    } catch (error) {
      next(error);
    }
  }

  static async updateLink(req: Request & reqUser, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, name, url } = req.body;
      const deletedFiles: [] = JSON.parse(req.body.deletedFiles ?? []);
      const link = await LinksService.updateLink(id, name, url, deletedFiles);
      res.send(new ServerResponce(true, "", link));
    } catch (error) {
      next(error);
    }
  }
}
export default LinksController;
