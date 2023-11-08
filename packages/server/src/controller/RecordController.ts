import { getManager } from "typeorm";
import { Record } from "../entity/Record";

export class RecordController {
	async getRecords(req, res) {
		const recordRepository = getManager().getRepository(Record);
		const records = await recordRepository.find();
		res.json(records);
	}

	async createRecord(req, res) {
		const recordRepository = getManager().getRepository(Record);
		const record = recordRepository.create(req.body);
		await recordRepository.save(record);
		res.send("record created successfully");
	}

	async getRecord(req, res) {
		const recordRepository = getManager().getRepository(Record);
		const record = await recordRepository.findOne(req.params.id);

		if (!record) {
			return res.send("User not found");
		}

		res.json(record);
	}

	async updateRecord(req, res) {
		const recordRepository = getManager().getRepository(Record);
		const record = await recordRepository.findOne(req.params.id);

		if (!record) {
			return res.send("record not found");
		}

		recordRepository.merge(record, req.body);
		await recordRepository.save(record);
		res.send("record updated successfully");
	}

	async deleteRecord(req, res) {
		const recordRepository = getManager().getRepository(Record);
		const record = await recordRepository.findOne(req.params.id);

		if (!record) {
			return res.send("record not found");
		}

		await recordRepository.remove(record);
		res.send("record deleted successfully");
	}

	async saveFile(req, res) {
		const recordRepository = getManager().getRepository(Record);
		let data = {
			filePath: req.file.path,
			fileType: req.body.type,
			userid: req.body.userid,
		};
		const record = recordRepository.create(data);
		await recordRepository.save(record);
		res.json({ code: 0, data: record });
	}
}
