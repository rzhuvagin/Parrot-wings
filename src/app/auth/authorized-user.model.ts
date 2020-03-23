export class AuthorizedUserModel {
  constructor(email: string, username: string, token: string) {
    this.email = email;
    this.username = username;
    this._token = token;
    this.loggedAt = new Date();
  }

  private _token: string;
  username: string;
  email: string;
  loggedAt: Date;


  public get token(): string {
    return this._token;
  }

}
