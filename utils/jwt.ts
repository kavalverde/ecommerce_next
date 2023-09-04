import jwt from "jsonwebtoken";

export const signToken = (_id: string, email: string) => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("JWT_SECRET_SEED is not defined");
  }
  return jwt.sign(
    // payload
    { _id, email },
    // secret
    process.env.JWT_SECRET_SEED,
    // options
    { expiresIn: "30d" }
  );
};

export const isValidToken = (token: string): Promise<string> => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("JWT_SECRET_SEED is not defined");
  }
  if (token.length < 10) return Promise.reject("Invalid token");
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET_SEED || "", (err, payload) => {
        if (err) {
          return reject("Invalid token");
        }
        const { _id } = payload as { _id: string };
        resolve(_id);
      });
    } catch (error) {
      reject("Invalid token");
    }
  });
};
