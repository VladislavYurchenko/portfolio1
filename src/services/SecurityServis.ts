import bcrypt from "bcrypt";
export class SecurityServis {
  static async genPreservedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password + process.env.PASSWORD_SALT, parseInt(process.env.SALT_ROUNDS));
  }

  static async checkPasswords(notSecurePassword: string, criptoPassword: string): Promise<boolean> {
    return await bcrypt.compare(notSecurePassword + process.env.PASSWORD_SALT, criptoPassword);
  }
}
