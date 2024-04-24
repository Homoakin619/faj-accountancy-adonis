"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmmaSeedsRunner = void 0;
const CmmaSeedersSource_1 = require("./CmmaSeedersSource");
class CmmaSeedsRunner {
    constructor(db, app, cmmaConfig, connectionName) {
        this.db = db;
        this.app = app;
        this.cmmaConfig = cmmaConfig;
        this.connectionName = connectionName;
        this.client = this.db.connection(this.connectionName || this.db.primaryConnectionName);
    }
    async getSeederSource(file) {
        const source = await file.getSource();
        if (typeof source === 'function') {
            return source;
        }
        throw new Error(`Invalid schema class exported by "${file.name}"`);
    }
    async getList() {
        return await new CmmaSeedersSource_1.CmmaSeedersSource(this.app, this.cmmaConfig).getSeeders();
    }
    async run(file) {
        const Source = await this.getSeederSource(file);
        const seeder = {
            status: 'pending',
            file: file,
        };
        if ('developmentOnly' in Source) {
            this.app.logger.warn(`Seeder "${file.name}" is using the deprecated flag "developmentOnly".`);
        }
        if ((Source.developmentOnly && !this.app.inDev) ||
            (Source.environment && !Source.environment.includes(this.app.nodeEnvironment))) {
            seeder.status = 'ignored';
            return seeder;
        }
        try {
            const seederInstance = new Source(this.client);
            if (typeof seederInstance.run !== 'function') {
                throw new Error(`Missing method "run" on "${seeder.file.name}" seeder`);
            }
            await seederInstance.run();
            seeder.status = 'completed';
        }
        catch (error) {
            seeder.status = 'failed';
            seeder.error = error;
        }
        return seeder;
    }
    async close() {
        await this.db.manager.closeAll(true);
    }
}
exports.CmmaSeedsRunner = CmmaSeedsRunner;
//# sourceMappingURL=CmmaSeedsRunner.js.map