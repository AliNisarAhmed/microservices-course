import mongoose from 'mongoose';

interface UserAttrs {
	email: string;
	password: string;
}

// an interface that describes the props that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}

// an interface that describes the props that a user Document has
interface UserDoc extends mongoose.Document {
	email: string;
	password: string;
}

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});

userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

User.build({ email: 'test@test.com', password: 'password' });

export { User };
