import { AppDataSource } from '../dataSource';
import { User } from '../entity/User';
import { getConfig } from '../config';

export class UserController {
  async getUsers(req, res) {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    res.json({ code: 0, data: users });
  }

  async createUser(req, res) {
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create(req.body);
    await userRepository.save(user);
    res.json({ code: 0, data: user });
  }

  async getUser(req, res) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: req.params.id });

    if (!user) {
      res.json({ code: -1, data: 'User not found' });
    }

    res.json({ code: 0, data: user });
  }

  async updateUser(req, res) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: req.params.id });

    if (!user) {
      res.json({ code: -1, data: 'User not found' });
    }

    userRepository.merge(user, req.body);
    await userRepository.save(user);
    res.json({ code: 0, data: user });
  }

  async deleteUser(req, res) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: req.params.id });

    if (!user) {
      res.json({ code: -1, data: 'User not found' });
    }

    await userRepository.remove(user);
    res.json({ code: 0, data: 'User deleted successfully' });
  }

  async getCurrentUser(req, res) {
    const userRepository = AppDataSource.getRepository(User);
    const config = getConfig();
    const user = await userRepository.findOneBy({ uuid: config.user.uuid });

    if (!user) {
      let _user = {
        ...config.user,
      };
      _user = userRepository.create(_user);
      await userRepository.save(_user);
      res.json({ code: 0, data: _user });
    }

    res.json({ code: 0, data: user });
  }

  async _getUserById(id) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: id });

    return user;
  }
}
