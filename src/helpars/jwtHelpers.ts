import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

const generateToken = (payload: any, secret: Secret, expiresIn: any) => {
    const options: SignOptions = {
      algorithm: 'HS256',
      expiresIn,
    };
  
    const token = jwt.sign(payload, secret, options);
    return token;
  };


const verifyToken = (token: string, secret: Secret) => {
    return jwt.verify(token, secret) as JwtPayload;
}

export const jwtHelpers = {
    generateToken,
    verifyToken
}