import { Router } from "express";
import Certificate from "../../models/Certificate";
import config from "../../config";
import passport from "passport";
import jwt from "jsonwebtoken";
import __ from "../../loaders/i18n";

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

      const { fileName, certificate } = req.body;

      const certificateSize = Buffer.from(certificate.split(",")[1], "base64");

      if (certificateSize.length > config.maxCertificateSize) {
        return res.status(400).json({
          status: "error",
          msg: `Certificate file should not be bigger then ${config.maxCertificateSize} bytes. It is ${certificateSize.length} bytes.`,
        });
      }

      const userId = jwt.decode(
        req.headers.authorization?.split(" ")[1] || ""
      ) as userIdType;

      if (
        await Certificate.findOne({
          where: { fileName: fileName || "" },
        })
      )
        return res.status(400).json({
          status: "error",
          msg: `${__("certificate.filenameTaken")}`,
        });

      const newCertificate = new Certificate({
        fileName: fileName,
        certificate: certificate,
        UserId: userId?.id,
      });

      await newCertificate
        .save()
        .then(() => {
          return res.status(201).json({
            status: "success",
            msg: `${__("certificate.uploaded")}`,
          });
        })
        .catch(
          /* istanbul ignore next */ () =>
            res.status(400).json({
              status: "error",
              msg: `${__("certificate.error")}`,
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
      /*  
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
        /* istanbul ignore next */ () =>
          res.status(400).json({
            status: "error",
            msg: `${__("certificate.download.error")}`,
          });
      }
    }
  );

  app.delete(
    "/certificates/delete/:id",
    passport.authenticate("jwt", {
      session: false,
    }),
    async (req, res) => {
      /*  
          #swagger.tags = ['Certificates']
          #swagger.summary = "Delete a certificate"
          #swagger.parameters['Authorization'] = {
            in: 'header',
            description: 'A JWT bearer',
            required: true,
          }
          #swagger.responses[200] = {
            description: 'Certificate deleted.',
          }
          #swagger.responses[400] = {
            description: 'Error on deleting certificate.',
          }
      */

      try {
        const userId = jwt.decode(
          req.headers.authorization?.split(" ")[1] || ""
        ) as userIdType;

        const rowsDeleted = await Certificate.destroy({
          where: { id: req.params.id, UserId: userId?.id },
        });

        return res.status(200).json({
          status: "success",
          msg: `Certificate deleted: ${rowsDeleted} matche(s)`,
        });
      } catch {
        /* istanbul ignore next */ () => {
          res.status(400).json({
            status: "error",
            msg: `${__("certificate.download.deleteError")}`,
          });
        };
      }
    }
  );
};
