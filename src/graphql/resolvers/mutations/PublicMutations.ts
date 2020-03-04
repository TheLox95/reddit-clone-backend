import User from "models/User";
import { Resolver } from "../Resolver";
import { sign } from 'jsonwebtoken';
import { UserInputError, AuthenticationError } from "apollo-server-express";
import { compare } from 'bcrypt';


export const userCreateOne: Resolver<{ username: string; password: string; email: string }> = async (...args) => {
    const [, { username, password, email }] = args;

    let u = await User.findOne({ username });
    if (u) throw new UserInputError('Username already used.');

    u = await User.findOne({ email });
    if (u) throw new UserInputError('Email already used.');
    
    const user = await User.create({
        username,
        password,
        email,
    });

    const { id } = user;
    const token = await sign({ id }, process.env.JWT_SECRET, { expiresIn: "30m" });
    return { token };
};

export const signIn: Resolver<{ login: string; password: string }> = async (...args) => {
    const [, { login, password }] = args;
    
    const user = await User.findOne({
        $or: [{ username: login }, { email: login }]
    }).select('+password').exec();

    if (!user) throw new UserInputError('No user found with this login credentials.');

    const isValid = await compare(password, user.password);

    if (!isValid) throw new AuthenticationError('Username or password incorrect');

    const { id } = user;
    const token = await sign({ id }, process.env.JWT_SECRET, { expiresIn: "30m" });
    return { token };
};

