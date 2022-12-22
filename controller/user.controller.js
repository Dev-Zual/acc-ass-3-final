const {
  createUserService,
  getUsersService,
  logInUserService,
} = require("../services/user.services");
const { generateToken } = require("../utils/token");

// creating user
exports.createUser = async (req, res) => {
  try {
    const user = await createUserService(req.body);

    const token = user.confirmationToken;

    res.status(200).json({
      status: "success",
      message: "successfully created user",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// get All users
exports.getUsers = async (req, res) => {
  try {
    const users = await getUsersService();
    res.status(200).json({
      status: "success",
      message: "successfully got user",
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
/**
 * 1. Check if Email and password are given
 * 2. Load user with email
 * 3. if not user send res
 * 4. compare password
 * 5. if password not correct send res
 * 6. check if user is active
 * 7. if not active send res
 * 8. generate token
 * 9. send user and token
 */
// login user
exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({
        status: "failed",
        message: "please provide your credentials!",
      });
    }
    const user = await logInUserService(email);
    if (!user) {
      return res.status(403).json({
        status: "failed",
        message: "user not found with this email, please create an account!",
      });
    }

    const isValidPassword = user.comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(403).json({
        status: "failed",
        message: "password is incorrect!",
      });
    }

    if (user.status != "active") {
      return res.status(403).json({
        status: "failed",
        message: "please active your account!",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      status: "success",
      message: "successfully login user",
      data: user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
