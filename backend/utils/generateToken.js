import jwt from "jsonwebtoken";

export const generateToken = async (res, userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  // console.log({ token });

  console.log("token.token", token);

  // res.cookie("token", token, {
  //   httpOnly: true,
  //   maxAge: 1000 * 60 * 60 * 24 * 7,
  //   sameSite: "strict",
  // });
};
