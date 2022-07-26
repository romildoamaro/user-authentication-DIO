import { User } from '..models/users.model';

declare module 'express-serve-static-core' {

    interface Request {
        user?: User;
    }
}