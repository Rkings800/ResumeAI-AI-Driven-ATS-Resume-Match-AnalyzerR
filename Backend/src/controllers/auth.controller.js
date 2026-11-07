const userModel = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


/**
 * 
 * @description : register a new user
 * @route : /api/auth/register
 * @method : POST
 * @access : PUBLIC
 */


async function registerUser(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please fill all the details"
        });
    }

    const UserisAlreadyExist = await userModel.findOne({
        $or: [{ email }, { username }]
    });

    if (UserisAlreadyExist) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash
    });

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    res.cookie("token", token, {
        httpOnly: true
    });

    return res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Please fill all the details"
        });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "User not found"
        });
    }

    const ispasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!ispasswordValid) {
        return res.status(400).json({
            message: "Invalid password"
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    res.cookie("token", token, {
        httpOnly: true
    });

    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}
async function logoutUser(req, res) {
    res.clearCookie("token");
    return res.status(200).json({
        message: "User logged out successfully"
    });
}  


module.exports = {
    registerUser,
    loginUser,
    logoutUser
};

