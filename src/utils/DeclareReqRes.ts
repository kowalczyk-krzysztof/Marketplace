// Goal of this is to avoid problems with accessing req.user and res.user which don't exist on default Request and Response interfaces in express

declare namespace Express {
  export interface Request {
    user: any;
  }
  export interface Response {
    user: any;
  }
}
