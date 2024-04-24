"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Systems/Client/PostsManagement/Models/Post"));
class PostActions {
    static async createPostRecord(createPostRecordOptions) {
        const { createPayload, dbTransactionOptions } = createPostRecordOptions;
        const post = new Post_1.default();
        post.fill(createPayload);
        if (dbTransactionOptions.useTransaction) {
            post.useTransaction(dbTransactionOptions.dbTransaction);
        }
        console.log(post.subscriptionId);
        await post.save();
        post.load('subscription');
        return post;
    }
    static async fetchAllContents() {
        return Post_1.default.query().preload('subscription');
    }
    static async fetchUserContent(postId, user) {
        const content = await this.getPostRecordById(postId);
        const usersubscriptions = (await user.related('subscriptions').query()).map(subscripton => subscripton.id);
        if (usersubscriptions.includes(content.subscriptionId)) {
            return content;
        }
        return null;
    }
    static async fetchUserContents(subscriptions) {
        let contents = [];
        for (let subscription of subscriptions) {
            let content = await subscription.related('content').query().first();
            contents.push(content);
        }
        return contents;
    }
    static async publishContent(postId) {
        const query = await Post_1.default.query().where("id", postId).first();
        query.isPublished = true;
        query.save();
        return query;
    }
    static async unpublishContent(postId) {
        const query = await Post_1.default.query().where("id", postId).first();
        query.isPublished = false;
        query.save();
        return query;
    }
    static async deleteContent(postId) {
        const content = await Post_1.default.query().where("id", postId).first();
        await content.delete();
        return null;
    }
    static async getPostRecordById(postId) {
        return Post_1.default.find(postId);
    }
    static async getPostRecordByIdentifier(identifier) {
        return Post_1.default.query().where('identifier', identifier).first();
    }
    static async getPostRecord(getPostOptions) {
        const { identifier, identifierType } = getPostOptions;
        const GetPost = {
            id: async () => await this.getPostRecordById(Number(identifier)),
            identifier: async () => await this.getPostRecordByIdentifier(String(identifier)),
        };
        return await GetPost[identifierType]();
    }
}
exports.default = PostActions;
//# sourceMappingURL=PostActions.js.map