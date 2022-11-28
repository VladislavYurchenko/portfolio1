import IUser from "../modelsInterfaces/IUser";

function instanceOfIUser(object: any): object is IUser {
  return typeof object.password === typeof "string";
}

export class User {
  id: string;
  email: string;
  name?: string;
  isActivated?: boolean;
  activationLink: string;
  constructor(idoruser: string | IUser | User, email?: string, activationLink?: string, name?: string, isActivated?: boolean) {
    if (idoruser instanceof User || instanceOfIUser(idoruser)) {
      this.id = idoruser.id;
      this.email = idoruser.email;
      this.name = idoruser.name;
      this.isActivated = idoruser.isActivated;
      this.activationLink = idoruser.activationLink;
    } else {
      this.id = idoruser;
      this.email = email;
      this.name = name;
      this.isActivated = isActivated;
      this.activationLink = activationLink;
    }
  }
}
export interface reqUser {
  user: User;
}
