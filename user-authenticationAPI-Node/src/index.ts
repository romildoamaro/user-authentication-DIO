import express from "express";
import errorHandler from "./middlewares/error-handler.middleware";
import authorizationRoute from "./routes/authorization-route";
import statusRoutes from "./routes/status.route";
import usersRoutes from "./routes/users.route";
import bearerAuthenticationMiddleware from './middlewares/bearer-authentication.middleware';

const app = express();

//Aplicação
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rotas
app.use(statusRoutes);
app.use(authorizationRoute);

app.use(bearerAuthenticationMiddleware);
app.use(usersRoutes);


//Handlers de erro
app.use(errorHandler);

//Servidor
app.listen(5000, () => {
  console.log("listening on port 5000");
});
