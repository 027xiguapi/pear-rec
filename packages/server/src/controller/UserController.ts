import { getManager } from "typeorm";
import { User } from "../entity/User";

export class UserController {
  async getUsers(req, res) {
    const userRepository = getManager().getRepository(User);
    const users = await userRepository.find();
    res.json(users);
  }

  async createUser(req, res) {
    const userRepository = getManager().getRepository(User);
    const user = userRepository.create(req.body);
    await userRepository.save(user);
    res.send("User created successfully");
  }

  async getUser(req, res) {
    const userRepository = getManager().getRepository(User);
    const user = await userRepository.findOne(req.params.id);
    
    if (!user) {
      return res.send("User not found");
    }

    res.json(user);
  }

  async updateUser(req, res) {
    const userRepository = getManager().getRepository(User);
    const user = await userRepository.findOne(req.params.id);
    
    if (!user) {
      return res.send("User not found");
    }

    userRepository.merge(user, req.body);
    await userRepository.save(user);
    res.send("User updated successfully");
  }

  async deleteUser(req, res) {
    const userRepository = getManager().getRepository(User);
    const user = await userRepository.findOne(req.params.id);

    if (!user) {
      return res.send("User not found");
    }

    await userRepository.remove(user);
    res.send("User deleted successfully");
  }
}
