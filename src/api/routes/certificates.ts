import { Router } from "express";
import Certificate from "../../models/Certificate";
import config from "../../config";
import passport from "passport";
import jwt from "jsonwebtoken";

const route = Router();

interface userIdType {
  id?: number;
}

export default (app: Router) => {
  app.use("/certificates", route);

  app.post(
    "/certificates/upload",
    passport.authenticate("jwt", {
      session: false,
    }),
    async (req, res) => {
      /*    
          #swagger.tags = ['Certificates']
          #swagger.summary = "Uploads a certificate"
          #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Uploads a new certificate.'
          }
    } */

      const { certificate } = req.body;

      const certificateSize = Buffer.from(certificate.split(",")[1], "base64");

      if (certificateSize.length > config.maxCertificateSize) {
        return res.status(400).json({
          status: "error",
          msg: `Certificate file should not be bigger then ${config.maxCertificateSize} bytes. It is ${certificateSize.length} bytes.`,
        });
      }

      if (await Certificate.findOne({ where: { certificate: certificate } }))
        return res.status(400).json({
          status: "error",
          msg: "Certificate already uploaded.",
        });

      const userId = jwt.decode(
        req.headers.authorization?.split(" ")[1] || ""
      ) as userIdType;

      const newCertificate = new Certificate({
        certificate: certificate,
        UserId: userId?.id,
      });

      newCertificate
        .save()
        .then(() => {
          return res.status(201).json({
            status: "success",
            msg: "Certificate is uploaded.",
          });
        })
        .catch((error) =>
          res.status(400).json({
            status: "error",
            msg: error,
          })
        );
    }
  );
};
