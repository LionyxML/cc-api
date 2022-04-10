import express from "express";

const rootRouter = express.Router();

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
        <pre>CC API server <br> is up and running...</pre>
    </div>
`;

rootRouter.get("/", (_req, res) => {
  return res.send(rootHTML);
});

export default rootRouter;
