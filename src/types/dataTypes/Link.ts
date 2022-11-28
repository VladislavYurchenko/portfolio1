import ILink from "../modelsInterfaces/ILink";
import IUser from "../modelsInterfaces/IUser";
export class ImageData {
  name: string;
  source: string;
  type: string;
  constructor(name: string, source: string, type: string) {
    this.name = name;
    this.source = source;
    this.type = type;
  }
}

class Link {
  id: number;
  user: IUser["_id"];
  name?: string;
  url?: string;
  images?: ImageData[];
  constructor(ilink: ILink, images: ImageData[] = []) {
    this.id = ilink.id;
    this.user = ilink.user;
    this.name = ilink.name;
    this.url = ilink.url;
    this.images = images;
  }
}

export default Link;
