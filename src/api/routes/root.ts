import { Router } from "express";
import __ from "../../loaders/i18n";

const route = Router();

const rootHTML = `
    <div 
    style="
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 3rem;"
    >
        <pre>${__("apiserver")} <br> ${__("isUp")}.</pre>
    </div>
`;

export default (app: Router) => {
  app.use("/", route);

  app.get("/", (_req, res) => {
    /*
        #swagger.tags = ['Root']
        #swagger.summary = "Shows HTML for initial page"
    */

    return res.send(rootHTML);
  });
};
