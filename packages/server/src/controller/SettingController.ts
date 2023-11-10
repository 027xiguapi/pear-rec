import { AppDataSource } from "../dataSource";
import { Setting } from "../entity/Setting";

export class SettingController {
	async getSettings(req, res) {
		const settingRepository = AppDataSource.getRepository(Setting);
		const settings = await settingRepository.find();
		res.json({ code: 0, data: settings });
	}

	async createSetting(req, res) {
		const settingRepository = AppDataSource.getRepository(Setting);
		const setting = settingRepository.create(req.body);
		await settingRepository.save(setting);
		res.json({ code: 0, data: setting });
	}

	async getSetting(req, res) {
		const settingRepository = AppDataSource.getRepository(Setting);
		const setting = await settingRepository.findOneBy({ id: req.params.id });

		if (!setting) {
			return res.json({ code: -1, data: "setting not found" });
		}

		res.json({ code: 0, data: setting });
	}

	async getSettingByUserId(req, res) {
		const settingRepository = AppDataSource.getRepository(Setting);
		const setting = await settingRepository
			.createQueryBuilder("setting")
			.leftJoinAndSelect("setting.user", "user")
			.where("user.id = :id", { id: req.params.userId })
			.getOne();

		if (!setting) {
			return res.json({ code: -1, data: "setting not found" });
		}

		res.json({ code: 0, data: setting });
	}

	async updateSetting(req, res) {
		const settingRepository = AppDataSource.getRepository(Setting);
		const setting = await settingRepository.findOneBy({ id: req.params.id });

		if (!setting) {
			return res.json({ code: -1, data: "setting not found" });
		}
		console.log(setting, req.body);
		settingRepository.merge(setting, req.body);
		await settingRepository.save(setting);
		res.json({ code: 0, data: setting });
	}

	async deleteSetting(req, res) {
		const settingRepository = AppDataSource.getRepository(Setting);
		const setting = await settingRepository.findOneBy({ id: req.params.id });

		if (!setting) {
			return res.json({ code: -1, data: "setting not found" });
		}

		await settingRepository.remove(setting);
		res.json({ code: 0, data: "setting deleted successfully" });
	}
}
