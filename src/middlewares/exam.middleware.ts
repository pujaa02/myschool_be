import { RoleEnum } from '@/common/constants/enum.constants';
import { generalResponse } from '@/common/helpers/response/generalResponse';
import { logger } from '@/common/utils/logger';
import { SECRET_KEY } from '@/config';
import Role from '@/sequelizeDir/models/role.model';
import { USER_STATUS } from '@/sequelizeDir/models/types/user.model.type';
import User from '@/sequelizeDir/models/user.model';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

async function verifyToken(req: Request, token) {
  try {
    const secretKey = SECRET_KEY;
    // Decode the token
    const decoded: any = jwt.verify(token.trim(), secretKey);
    if (decoded.userId && (decoded.examId || decoded.trainer_slug)) {
      req.examTokenInfo = {
        userId: decoded.userId,
        examId: decoded.examId,
        trainer_slug: decoded.trainer_slug,
      };
      return true;
    } else if (decoded.userId && decoded.email) {
      //if token has admin details then bypass admin
      const userDetails = await User.findOne({
        where: {
          active: USER_STATUS.ACTIVE,
          id: decoded.userId,
          email: decoded.email,
        },
        include: [
          {
            model: Role,
          },
        ],
      });
      if (userDetails.role.name === RoleEnum.Admin) return true;
      return false;
    } else {
      return false;
    }
  } catch (error) {
    logger.error('EXAM-AUTH-ERROR: %s', error);
    return false;
  }
}

// Middleware function to check exam authorization
function checkExamAuthorization(req, res, next) {
  if (req.headers['exam-authorization']) {
    const examToken = req.headers['exam-authorization'];
    // Check if examToken exists
    if (!examToken) {
      return generalResponse(req, res, null, 'EXAM_TOKEN_NOT_FOUND', true, 'error', 400);
    }

    // Verify the token
    if (!verifyToken(req, examToken)) {
      return generalResponse(req, res, null, 'UNAUTHORIZED_ERROR', true, 'error', 400);
    }

    next();
  } else {
    next();
    if (req.headers['authorization']) {
      if (!verifyToken(req, req.headers['authorization'].replace('JWT', ''))) {
        return generalResponse(req, res, null, 'UNAUTHORIZED_ERROR', true, 'error', 400);
      }
    }
  }
}

export default checkExamAuthorization;
