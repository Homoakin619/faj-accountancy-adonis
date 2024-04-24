"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmmaMigratorContract = void 0;
const slash_1 = __importDefault(require("slash"));
const events_1 = require("events");
const utils_1 = require("@poppinss/utils");
const CmmaMigratorSource_1 = require("./CmmaMigratorSource");
class CmmaMigratorContract extends events_1.EventEmitter {
    constructor(db, app, options, cmmaConfig) {
        super();
        this.db = db;
        this.app = app;
        this.options = options;
        this.cmmaConfig = cmmaConfig;
        this.client = this.db.connection(this.options.connectionName || this.db.primaryConnectionName);
        this.config = this.db.getRawConnection(this.client.connectionName).config;
        this.migrationsConfig = Object.assign({
            tableName: 'adonis_schema',
            disableTransactions: false,
        }, this.config.migrations);
        this.schemaTableName = this.migrationsConfig.tableName;
        this.schemaVersionsTableName = `${this.schemaTableName}_versions`;
        this.booted = false;
        this.migrationSource = new CmmaMigratorSource_1.CmmaMigratorSource(this.config, this.app, this.cmmaConfig);
        this.direction = this.options.direction;
        this.dryRun = !!this.options.dryRun;
        this.disableLocks = !!this.options.disableLocks;
        this.migratedFiles = {};
        this.error = null;
        this.version = 2;
    }
    get status() {
        return !this.booted
            ? 'pending'
            : this.error
                ? 'error'
                : Object.keys(this.migratedFiles).length
                    ? 'completed'
                    : 'skipped';
    }
    async getClient(disableTransactions) {
        if (disableTransactions || this.migrationsConfig.disableTransactions || this.dryRun) {
            return this.client;
        }
        return this.client.transaction();
    }
    async rollback(client) {
        if (client.isTransaction) {
            await client.rollback();
        }
    }
    async commit(client) {
        if (client.isTransaction) {
            await client.commit();
        }
    }
    async recordMigrated(client, name, executionResponse) {
        if (this.dryRun) {
            this.migratedFiles[name].queries = executionResponse;
            return;
        }
        await client.insertQuery().table(this.schemaTableName).insert({
            name,
            batch: this.migratedFiles[name].batch,
        });
    }
    async recordRollback(client, name, executionResponse) {
        if (this.dryRun) {
            this.migratedFiles[name].queries = executionResponse;
            return;
        }
        await client.query().from(this.schemaTableName).where({ name }).del();
    }
    async getMigrationSource(migration) {
        const source = await migration.getSource();
        if (typeof source === 'function' && 'disableTransactions' in source) {
            return source;
        }
        throw new Error(`Invalid schema class exported by "${migration.name}"`);
    }
    async executeMigration(migration) {
        const Schema = await this.getMigrationSource(migration);
        const client = await this.getClient(Schema.disableTransactions);
        try {
            const schema = new Schema(client, migration.name, this.dryRun);
            this.emit('migration:start', this.migratedFiles[migration.name]);
            if (this.direction === 'up') {
                const response = await schema.execUp();
                await this.recordMigrated(client, migration.name, response);
            }
            else if (this.direction === 'down') {
                const response = await schema.execDown();
                await this.recordRollback(client, migration.name, response);
            }
            await this.commit(client);
            this.migratedFiles[migration.name].status = 'completed';
            this.emit('migration:completed', this.migratedFiles[migration.name]);
        }
        catch (error) {
            this.error = error;
            this.migratedFiles[migration.name].status = 'error';
            this.emit('migration:error', this.migratedFiles[migration.name]);
            await this.rollback(client);
            throw error;
        }
    }
    async acquireLock() {
        if (!this.client.dialect.supportsAdvisoryLocks || this.disableLocks) {
            return;
        }
        const acquired = await this.client.dialect.getAdvisoryLock(1);
        if (!acquired) {
            throw new utils_1.Exception('Unable to acquire lock. Concurrent migrations are not allowed');
        }
        this.emit('acquire:lock');
    }
    async releaseLock() {
        if (!this.client.dialect.supportsAdvisoryLocks || this.disableLocks) {
            return;
        }
        const released = await this.client.dialect.releaseAdvisoryLock(1);
        if (!released) {
            throw new utils_1.Exception('Migration completed, but unable to release database lock');
        }
        this.emit('release:lock');
    }
    async makeMigrationsTable() {
        const hasTable = await this.client.schema.hasTable(this.schemaTableName);
        if (hasTable) {
            return;
        }
        this.emit('create:schema:table');
        await this.client.schema.createTable(this.schemaTableName, (table) => {
            table.increments().notNullable();
            table.string('name').notNullable();
            table.integer('batch').notNullable();
            table.timestamp('migration_time').defaultTo(this.client.getWriteClient().fn.now());
        });
    }
    async makeMigrationsVersionsTable() {
        const hasTable = await this.client.schema.hasTable(this.schemaVersionsTableName);
        if (hasTable) {
            return;
        }
        this.emit('create:schema_versions:table');
        await this.client.schema.createTable(this.schemaVersionsTableName, (table) => {
            table.integer('version').notNullable();
        });
    }
    async getLatestVersion() {
        const rows = await this.client.from(this.schemaVersionsTableName).select('version').limit(1);
        if (rows.length) {
            return Number(rows[0].version);
        }
        else {
            await this.client.table(this.schemaVersionsTableName).insert({ version: 1 });
            return 1;
        }
    }
    async upgradeFromOnetoTwo() {
        const migrations = await this.getMigratedFilesTillBatch(0);
        const client = await this.getClient(false);
        try {
            await Promise.all(migrations.map((migration) => {
                return client
                    .from(this.schemaTableName)
                    .where('id', migration.id)
                    .update({
                    name: (0, slash_1.default)(migration.name),
                });
            }));
            await client.from(this.schemaVersionsTableName).where('version', 1).update({ version: 2 });
            await this.commit(client);
        }
        catch (error) {
            this.rollback(client);
            throw error;
        }
    }
    async upgradeVersion(latestVersion) {
        if (latestVersion === 1) {
            this.emit('upgrade:version', { from: 1, to: 2 });
            await this.upgradeFromOnetoTwo();
        }
    }
    async getLatestBatch() {
        const rows = await this.client.from(this.schemaTableName).max('batch as batch');
        return Number(rows[0].batch);
    }
    async getMigratedFiles() {
        const rows = await this.client
            .query()
            .from(this.schemaTableName)
            .select('name');
        return new Set(rows.map(({ name }) => name));
    }
    async getMigratedFilesTillBatch(batch) {
        return this.client
            .query()
            .from(this.schemaTableName)
            .select('name', 'batch', 'migration_time', 'id')
            .where('batch', '>', batch)
            .orderBy('id', 'desc');
    }
    async boot() {
        this.emit('start');
        this.booted = true;
        await this.acquireLock();
        await this.makeMigrationsTable();
    }
    async shutdown() {
        await this.releaseLock();
        this.emit('end');
    }
    async runUp() {
        const batch = await this.getLatestBatch();
        const existing = await this.getMigratedFiles();
        const collected = await this.migrationSource.getMigrations();
        collected.forEach((migration) => {
            if (!existing.has(migration.name)) {
                this.migratedFiles[migration.name] = {
                    status: 'pending',
                    queries: [],
                    file: migration,
                    batch: batch + 1,
                };
            }
        });
        const filesToMigrate = Object.keys(this.migratedFiles);
        for (let name of filesToMigrate) {
            await this.executeMigration(this.migratedFiles[name].file);
        }
    }
    async runDown(batch) {
        if (this.app.inProduction && this.migrationsConfig.disableRollbacksInProduction) {
            throw new Error('Rollback in production environment is disabled. Check "config/database" file for options.');
        }
        if (batch === undefined) {
            batch = (await this.getLatestBatch()) - 1;
        }
        const existing = await this.getMigratedFilesTillBatch(batch);
        const collected = await this.migrationSource.getMigrations();
        existing.forEach((file) => {
            const migration = collected.find(({ name }) => name === file.name);
            if (!migration) {
                throw new utils_1.Exception(`Cannot perform rollback. Schema file {${file.name}} is missing`, 500, 'E_MISSING_SCHEMA_FILES');
            }
            this.migratedFiles[migration.name] = {
                status: 'pending',
                queries: [],
                file: migration,
                batch: file.batch,
            };
        });
        const filesToMigrate = Object.keys(this.migratedFiles);
        for (let name of filesToMigrate) {
            await this.executeMigration(this.migratedFiles[name].file);
        }
    }
    on(event, callback) {
        return super.on(event, callback);
    }
    async getList() {
        const existingCollected = new Set();
        await this.makeMigrationsTable();
        const existing = await this.getMigratedFilesTillBatch(0);
        const collected = await this.migrationSource.getMigrations();
        const list = collected.map((migration) => {
            const migrated = existing.find(({ name }) => migration.name === name);
            if (migrated) {
                existingCollected.add(migrated.name);
                return {
                    name: migration.name,
                    batch: migrated.batch,
                    status: 'migrated',
                    migrationTime: migrated.migration_time,
                };
            }
            return {
                name: migration.name,
                status: 'pending',
            };
        });
        existing.forEach(({ name, batch, migration_time }) => {
            if (!existingCollected.has(name)) {
                list.push({ name, batch, migrationTime: migration_time, status: 'corrupt' });
            }
        });
        return list;
    }
    async run() {
        try {
            await this.boot();
            await this.makeMigrationsVersionsTable();
            const latestVersion = await this.getLatestVersion();
            if (latestVersion < this.version) {
                await this.upgradeVersion(latestVersion);
            }
            if (this.direction === 'up') {
                await this.runUp();
            }
            else if (this.options.direction === 'down') {
                await this.runDown(this.options.batch);
            }
        }
        catch (error) {
            this.error = error;
        }
        await this.shutdown();
    }
    async close() {
        await this.db.manager.closeAll(true);
    }
}
exports.CmmaMigratorContract = CmmaMigratorContract;
//# sourceMappingURL=CmmaMigratorContract.js.map