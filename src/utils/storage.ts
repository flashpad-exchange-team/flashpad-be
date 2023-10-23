import low from "lowdb";
import FileAsync from "lowdb/adapters/FileAsync";

function defaults() {
	return {
		lastCrawledBlock: 1776150,
	};
}

class Storage {
	db: any;
	constructor() {}

	/**
	 * Must be called before using an instance of this class
	 */
	async init(dbFile: string) {
		console.info(
			`Initializing storage at ${dbFile}. Current directory: ${process.cwd()}`
		);
		const adapter = new FileAsync(dbFile, { defaultValue: defaults() });
		this.db = await low(adapter);
	}

	async processBlock(blockNum: number) {
		await this.db.set("lastCrawledBlock", blockNum).write();
	}

	async getCurrentBlockNumber() {
		return this.db.get("lastCrawledBlock").value();
	}
}

const storage = new Storage();

export default storage;
