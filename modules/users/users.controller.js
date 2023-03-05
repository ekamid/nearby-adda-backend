const apiResponse = require("../../helpers/apiResponse");
const { createJWToken } = require("../../helpers/jwt");
const UsersService = require("./users.service");

const createUser = async (req, res) => {
  try {
    const user = await UsersService.createUser(req.body);

    if (!user) {
      apiResponse.ErrorResponse(res, "Something went wrong");
    }

    apiResponse.successResponse(res, "User Created Successfully!");
  } catch (err) {
    apiResponse.ErrorResponse(res, err);
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await UsersService.getUserByEmail(req.body.email);

    if (!user) {
      return apiResponse.unauthorizedResponse(res, "User not found");
    }

    let isMatch = user.comparePassword(req.body.password);

    if (!isMatch) {
      return apiResponse.unauthorizedResponse(res, "Invalid Password");
    }

    if (!user.verified) {
      return apiResponse.unauthorizedResponse(
        res,
        "Your account is not verified."
      );
    }

    let userData = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    };

    const data = createJWToken(userData);

    apiResponse.successResponseWithData(res, "User logged in successfully", {
      token: data.token,
    });
  } catch (err) {
    apiResponse.ErrorResponse(res, err);
  }
};

const getAuthenticatedUser = async (req, res) => {
  const { user } = req;
  try {
    const authenticatedUser = await UsersService.getUserById(user.id);

    if (!authenticatedUser) {
      return apiResponse.notFoundResponse(res, "User not found");
    }

    return apiResponse.successResponseWithData(
      res,
      "Logged in user data retrived successfully",
      {
        user: authenticatedUser,
      }
    );
  } catch (err) {
    apiResponse.ErrorResponse(res, err);
  }
};

const updateUserAddress = async (req, res) => {
  const { user, body } = req;
  try {
    const updatedUser = await UsersService.updateUserAddress(user.id, body);

    if (!updatedUser.address) {
      apiResponse.ErrorResponse(res, "Something went wrong");
    }

    return apiResponse.successResponse(
      res,
      "Uesr address updated successfully"
    );
  } catch (err) {
    console.log(err);
    apiResponse.ErrorResponse(res, err);
  }
};

module.exports = {
  createUser,
  loginUser,
  getAuthenticatedUser,
  updateUserAddress,
};
