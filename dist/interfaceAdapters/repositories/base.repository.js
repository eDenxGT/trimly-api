export class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async find(filter = {}) {
        return this.model.find(filter);
    }
    async findAll(filter = {}, skip = 0, limit = 10) {
        const [items, total] = await Promise.all([
            this.model.find(filter).skip(skip).limit(limit).lean(),
            this.model.countDocuments(filter),
        ]);
        return { items, total };
    }
    async findOne(filter) {
        return this.model.findOne(filter).lean();
    }
    async save(data) {
        return this.model.create(data);
    }
    async update(filter, updateData) {
        return this.model
            .findOneAndUpdate(filter, updateData, { new: true })
            .lean();
    }
    async delete(filter) {
        return this.model.findOneAndDelete(filter).lean();
    }
    async deleteAll(filter) {
        await this.model.deleteMany(filter);
    }
    async countDocuments(filter) {
        return this.model.countDocuments(filter);
    }
}
