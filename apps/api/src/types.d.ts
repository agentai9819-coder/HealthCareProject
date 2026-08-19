import "express-session";
import { Role } from "home-healthcare-types";

declare module "express-session" {
  interface SessionData {
    customerId?: string;
    staffId?: string;
    staffRole?: Role;
  }
}