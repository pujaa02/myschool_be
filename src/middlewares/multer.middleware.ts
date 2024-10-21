// import { FILE_FIELD_NAME_OBJ } from '@/common/constants/multer.constants';
// import { HttpException } from '@/common/helpers/response/httpException';
// import { fileOrFolderExistCheck } from '@/common/utils';
// import {
//   AWS_S3_ACCESS_KEY_ID,
//   AWS_S3_BUCKET,
//   AWS_S3_REGION,
//   AWS_S3_SECRET_ACCESS_KEY,
//   FILE_UPLOAD_PROCEDURE,
//   WASAPI_ACCESS_KEY_ID,
//   WASAPI_BUCKET,
//   WASAPI_REGION,
//   WASAPI_SECRET_ACCESS_KEY,
// } from '@/config';
// import { S3Client } from '@aws-sdk/client-s3';
// import { generalResponse } from '@helpers/response/generalResponse';
// import AWS from 'aws-sdk';
// import { NextFunction, Request, Response } from 'express';
// import fs from 'fs';
// import _ from 'lodash';
// import multer, { diskStorage } from 'multer';
// import multerS3 from 'multer-s3';
// import path from 'path';
// import util from 'util';
// import { v4 as uuidv4 } from 'uuid';

// export const checkFileType = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//   if (FILE_FIELD_NAME_OBJ?.[file.fieldname]) {
//     if (
//       FILE_FIELD_NAME_OBJ?.[file.fieldname].fileTypes.includes(file.mimetype) ||
//       file.originalname.substring(file.originalname.lastIndexOf('.') + 1) === 'glb'
//     ) {
//       cb(null, true);
//     } else {
//       cb(new Error(`${(file?.mimetype || '').split('/').at(-1)} type is not allowed`));
//     }
//   } else if (req.query.folder_name) {
//     cb(null, true);
//   } else {
//     cb(new Error('Wrong File Upload Field !!'));
//   }
// };

// export const getWasabiS3Config = () => {
//   const AWSendpoint: any = new AWS.Endpoint(`s3.${WASAPI_REGION}.wasabisys.com`);
//   return new S3Client({
//     region: WASAPI_REGION,
//     endpoint: AWSendpoint,
//     credentials: {
//       accessKeyId: WASAPI_ACCESS_KEY_ID,
//       secretAccessKey: WASAPI_SECRET_ACCESS_KEY,
//     },
//   });
// };

// export const getS3Config = () => {
//   return new S3Client({
//     region: AWS_S3_REGION,
//     credentials: {
//       accessKeyId: AWS_S3_ACCESS_KEY_ID,
//       secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
//     },
//   });
// };

// const setFileKey = async (req: Request, file) => {
//   const postfix = uuidv4().slice(0, 2) + 1;
//   const newFileName = `${file.originalname.split('.').at(0)}_${Date.now()}${postfix}${path.extname(file.originalname)}`
//     .replace(/\s/g, '_')
//     .trim();

//   let folderPath;

//   if (FILE_FIELD_NAME_OBJ?.[file.fieldname]) {
//     folderPath = `${FILE_FIELD_NAME_OBJ?.[file.fieldname]?.directory}`;
//   } else if (req.query.folder_name) {
//     folderPath = `/images/${req.query.folder_name}`;
//   } else {
//     folderPath = `/temp`;
//   }

//   return `${folderPath}/${newFileName}`;
// };

// const getStorageProcedure = (req: Request) => {
//   if (FILE_UPLOAD_PROCEDURE === 's3' || FILE_UPLOAD_PROCEDURE === 'wasabi') {
//     return multerS3({
//       s3: FILE_UPLOAD_PROCEDURE === 's3' ? getS3Config() : getWasabiS3Config(),
//       acl: 'public-read',
//       bucket: FILE_UPLOAD_PROCEDURE === 's3' ? AWS_S3_BUCKET : WASAPI_BUCKET,
//       metadata: (req3, file, callBack) => {
//         callBack(null, { fieldName: file.fieldname });
//       },
//       contentType: (req3, file, callBack) => {
//         callBack(null, file.mimetype);
//       },
//       key: async (req4, file, callBack) => {
//         const fullPath = await setFileKey(req, file);
//         callBack(null, fullPath);
//       },
//     });
//   } else {
//     return diskStorage({
//       destination: (_req, _file, cb) => {
//         fileOrFolderExistCheck(`./public/` + FILE_FIELD_NAME_OBJ?.[_file.fieldname].directory + `/`);
//         cb(null, './public/' + FILE_FIELD_NAME_OBJ?.[_file.fieldname].directory + '/');
//       },
//       filename: (_req: Request, file, cb) => {
//         const postfix = uuidv4().slice(0, 2) + 1;
//         return cb(null, `${file.originalname.split('.').at(0)}_${Date.now()}${postfix}${path.extname(file.originalname)}`);
//       },
//     });
//   }
// };

// export const fileUpload = (_fileSize: number) => async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // const file_size = fileSize * 1024 * 1024;

//     const uploadS3 = multer({
//       storage: getStorageProcedure(req),
//       // limits: { fileSize: file_size },
//       limits: {},
//       fileFilter(req5, file, cb) {
//         checkFileType(req5, file, cb);
//       },
//     }).any();

//     const uploadImages = async () => {
//       try {
//         const uploadS3Promise = util.promisify(uploadS3);
//         await uploadS3Promise(req, res);

//         if (req.files && req.files instanceof Array && req.files.length > 0) {
//           const fileType = getFileType(req.files[0]);
//           const fileSizeLimit = getFileSizeLimit(fileType); // Function to get size limit based on file type
//           if (req.files[0].size > fileSizeLimit * 1024 * 1024) {
//             deleteFile(req.files[0].path, fileSizeLimit, res);
//           }
//         }

//         next();
//       } catch (err) {
//         return generalResponse(req, res, err, err?.message ?? err, true, 'error', 400);
//       }
//     };
//     const getFileType = (file: Express.Multer.File): string | null => {
//       // Logic to determine the file type based on your fieldname or other criteria
//       if (FILE_FIELD_NAME_OBJ[file.fieldname]) {
//         return FILE_FIELD_NAME_OBJ[file.fieldname].type;
//       }
//       // Add more checks if needed for other cases
//       return null;
//     };

//     const getFileSizeLimit = (fileType: string | null): number => {
//       switch (fileType) {
//         case 'video':
//           return 50; // MB
//         case 'image':
//           return 10; // MB
//         case 'document':
//           return 10; // MB
//         default:
//           return 10; // Default limit for unrecognized file types
//       }
//     };

//     await uploadImages();
//   } catch (e) {
//     // return generalResponse(req, res, null, 'SOMETHING_WRONG', true, 'error', 500);
//     throw new HttpException(400, 'SOMETHING_WRONG');
//   }
// };

// const deleteFile = (req, fileSize, res) => {
//   fs.unlink(req.files[0].path, (err3) => {
//     if (err3) {
//       return generalResponse(req, res, null, 'SOMETHING_WRONG', true, 'error', 400);
//     }
//     return generalResponse(req, res, null, `FILE_BIG_ERROR`, true, 'error', 400);
//   });
// };

// export const fileUploadHelper = (data, fieldName: string, fieldEnum: string, customFieldName?: string) => {
//   _.forEach(data.files || [], (file: Express.MulterS3.File) => {
//     if (file.fieldname === fieldEnum) {
//       if (customFieldName) fieldName = customFieldName;
//       data[`${fieldName}`] = file.path;
//     }
//   });
//   // delete data.files;
//   return data;
// };

// export const fileUploadHelperPath = (data, fieldName: string, fieldEnum: string, customFieldName?: string) => {
//   let path;
//   _.forEach(data.files || [], (file: Express.MulterS3.File) => {
//     if (file.fieldname === fieldEnum) {
//       if (customFieldName) fieldName = customFieldName;
//       data[`${fieldName}`] = file.path;
//       path = file.path;
//     }
//   });
//   // delete data.files;
//   return path;
// };
