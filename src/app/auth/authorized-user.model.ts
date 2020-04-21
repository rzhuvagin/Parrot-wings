export class AuthorizedUserModel {
  constructor(email: string, username: string, token: string) {
    this.email = email;
    this.username = username;
    this.token = token;
    this.loggedAt = new Date();
  }

  token: string;
  username: string;
  email: string;
  loggedAt: Date;
}
