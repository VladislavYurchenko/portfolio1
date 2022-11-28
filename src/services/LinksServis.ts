import ILink from "../types/modelsInterfaces/ILink";
import LinkModel from "../models/LinkModel";
import Link from "../types/dataTypes/Link";
import FilesServis from "./FilesServis";
import { ImageData } from "./../types/dataTypes/Link";
class LinksService {
  static async getLinksCount(user: string): Promise<number> {
    const links = await LinkModel.find({ user: user });
    return links.length;
  }

  static async getLinks(user: string): Promise<Link[]> {
    const links = await LinkModel.find({ user: user });

    const newLinks: Link[] = [];
    for (const link of links) {
      const images = this.getImages(link.user.toString(), link.id.toString(), []);
      newLinks.push(new Link(link, images));
    }
    return newLinks;
  }

  static async addLink(user: string, name = "", url = ""): Promise<Link> {
    const link: ILink = await LinkModel.create({ user, name, url });
    return new Link(link, []);
  }

  static async updateLink(linkId: string, name: string, url: string, deletedFiles: string[]): Promise<Link> {
    const oldLink: ILink = await LinkModel.findById(linkId);
    oldLink.name = name;
    oldLink.url = url;
    const dbdata: ILink = await LinkModel.findByIdAndUpdate(linkId, oldLink, { new: true });
    if (deletedFiles) {
      const path = FilesServis.generatePath(process.env.USERDATADIR, dbdata.user.toString(), linkId);
      FilesServis.deleteLinksImage(path, deletedFiles);
    }
    const link = new Link(dbdata, this.getImages(dbdata.user.toString(), dbdata.id.toString(), deletedFiles));

    return link;
  }

  static async deleteLink(id: string): Promise<ILink> {
    const dbdata: ILink = await LinkModel.findByIdAndDelete(id);
    const linkDir = FilesServis.generatePath(process.env.USERDATADIR, dbdata.user.toString(), dbdata.id.toString());
    const files = FilesServis.getFilesList(linkDir);
    FilesServis.deleteLinksImage(linkDir, files);
    return dbdata;
  }

  static async deleteAllLink(user: string): Promise<any> {
    const links: ILink[] = await LinkModel.find({ user });
    links.forEach((link) => {
      const linkDir = FilesServis.generatePath(process.env.USERDATADIR, link.user.toString(), link.id.toString());
      const files = FilesServis.getFilesList(linkDir);
      FilesServis.deleteLinksImage(linkDir, files);
    });
    const deleteResult = await LinkModel.deleteMany({ user });
    return deleteResult;
  }

  static getImages(userID: string, linkID: string, blackList: string[]): ImageData[] {
    const userDir = FilesServis.generatePath(process.env.USERDATADIR, userID);
    const linkDir = FilesServis.generatePath(userDir, linkID);
    const images: ImageData[] = [];
    if (FilesServis.fileIssue(linkDir)) {
      const files = FilesServis.getFilesList(linkDir);
      for (const file of files) {
        if (!blackList.includes(file)) {
          const filePath = FilesServis.generatePath(linkDir, file);
          images.push(FilesServis.genImageData(filePath, file));
        }
      }
    }
    return images;
  }
}
export default LinksService;
