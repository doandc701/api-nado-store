import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import sanitize from "mongo-sanitize"; // ngan chan injection
import ip from "ip";
import { client } from "../../services/redis.service";
import { ObjectDatabase } from "../../models/auth";
import { TOKEN_SECRET } from "../../config/auth";
import { getRedis, setRedis } from "../../utils/redis";
import {
  checkLoginAttempts,
  setLoginAttempts,
} from "../../middlewares/loginAccountLimiter";

const ROLES = ObjectDatabase.role;
const USER = ObjectDatabase.user;

const SignUp = async (req: Request, res: Response) => {
  const checkMailExits = await USER.findOne({
    email: sanitize(req.body.email),
  }).catch(() => {});
  if (checkMailExits) {
    res.status(422).send({ message: "Lỗi! Email này đã tồn tại." });
    return;
  }

  const user = new USER({
    email: sanitize(req.body.email),
    password: bcrypt.hashSync(req.body.password, 8),
  });
  // upload 1 ảnh
  if (req.file) {
    user.avatar = req.file.path;
  }

  /* up load nhieu anh
   if (req.files) {
    let path = "";
    req.files.forEach(function (files, index, arr) {
      path = path + files.path + ",";
    });
    path = path.substring(0, path.lastIndexOf(","));
    user.avatar = path;
  }
  */
  user
    .save()
    .then((user) => {
      console.log("user", user);
      const RqRoles = req.body.roles;
      if (RqRoles) {
        ROLES.find({ name: { $in: RqRoles } })
          .then((roles) => {
            console.log("roles", roles);
            user.roles = roles.map((role) => role._id);
            user
              .save()
              .then(() => {
                res.send({ message: "Tài khoản được đăng ký thành công!" });
              })
              .catch((err) => {
                res.status(500).send({ message: err });
                return;
              });
          })
          .catch((err) => {
            res.status(500).send({ message: err });
            return;
          });
      } else {
        ROLES.findOne({ name: "user" })
          .then((role1) => {
            // Error, role1._id may be null or undefined
            console.log("ObjectId+++++++", role1);
            user.roles = [role1!._id];
            user
              .save()
              .then(() => {
                res.send({ message: "Tài khoản được đăng ký thành công!" });
              })
              .catch((err) => {
                res.status(500).send({ message: err });
                return;
              });
          })
          .catch((err) => {
            res.status(500).send({ message: err });
            return;
          });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err });
      return;
    });
};

const SignIn = async (req: Request, res: Response, next: NextFunction) => {
  console.log("req", req.body);
  let checkRedis = await checkLoginAttempts(ip.address());
  if (checkRedis?.pass) {
    USER.findOne({
      $or: [
        { username: sanitize(req.body.username) },
        { email: sanitize(req.body.username) },
      ],
    })
      .populate("roles", "-__v")
      .then(async (user: any) => {
        if (!user) {
          res
            .status(400)
            .send({ message: "Tài khoản hoặc mật khẩu không đúng !" });
          return;
        }
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsValid) {
          checkRedis = await setLoginAttempts(ip.address());
          const remaining = 3 - parseInt(checkRedis.data.count);
          res.status(404).send({
            message: `${
              remaining
                ? `Bạn còn ${remaining} lần nhập`
                : "Tài khoản hoặc mật khẩu không đúng !"
            }`,
          });
          return;
        }
        const token = jwt.sign({ id: user.id }, TOKEN_SECRET, {
          expiresIn: 86400, // 24 hours
        });
        console.log("token", token);
        let authorities = [];
        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        res.status(200).send({
          data: {
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token,
          },
          message: "Đăng nhập thành công.",
        });
      })
      .catch(() => {});
  }
  if (!checkRedis?.pass) {
    if (checkRedis?.data) {
      const wait1 = checkRedis.wait;
      // console.log(wait1);
      const remaining = 3 - parseInt(checkRedis.data.count);
      if (remaining <= 0) {
        return res.status(404).send({
          message: `Tài khoản của bạn đã bị khóa, vui lòng thử lại sau ${wait1} giây.`,
        });
      } else {
        return res.status(404).send({
          message: `Bạn còn ${remaining} lần nhập`,
        });
      }
    }
  }
};

export { SignIn, SignUp };
