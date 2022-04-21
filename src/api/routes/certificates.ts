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

      await newCertificate
        .save()
        .then(() => {
          return res.status(201).json({
            status: "success",
            msg: "Certificate is uploaded.",
          });
        })
        .catch(() =>
          res.status(400).json({
            status: "error",
            msg: "Error on saving... contact sys admin",
          })
        );
    }
  );

  app.get(
    "/certificates/list",
    passport.authenticate("jwt", {
      session: false,
    }),
    async (req, res) => {
      /*  TODO: fix it here
          #swagger.tags = ['Certificates']
          #swagger.summary = "Get logged in user's certificates"
          #swagger.parameters['Authorization'] = {
            in: 'header',
            description: 'A JWT bearer',
            required: true,
          }
          #swagger.responses[200] = {
            description: 'Certificates listed.',
          }
      */

      try {
        const userId = jwt.decode(
          req.headers.authorization?.split(" ")[1] || ""
        ) as userIdType;

        const certificates = await Certificate.findAll({
          where: { UserId: userId?.id },
          raw: true,
        });

        return res.status(200).json({
          status: "success",
          certificates: certificates,
        });
      } catch {
        return res.status(400).json({
          status: "error",
          msg: "Error on getting certificates.",
        });
      }
    } // async
  );
};
