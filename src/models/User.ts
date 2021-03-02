import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import crypto from 'crypto';
interface User extends mongoose.Document {
  name: string;
  email: string;
  role: string;
  password: string;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: number | undefined;
  createdAt: Date;
  getSignedJwtToken(): string;
  matchPassword(enteredPassword: string): string;
  getResetPasswordToken(): string;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      maxlenght: [20, 'Name can not be more than 20 characters'],
    },

    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    role: {
      type: String,
      enum: ['USER', 'MERCHANT'],
      default: 'USER',
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false, // makes it so when getting the password from db, we won't see it
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: { type: Date, immutable: true },
  },
  { timestamps: true } // this has to be passed to constructor, so after the object with all properties
);

// Encrypt password using bcrypt
UserSchema.pre<User>('save', async function (next): Promise<void> {
  // Without this check you are unable to .save() because you're not providing a password and this.password becomes undefined
  if (!this.isModified('password')) {
    next();
  }
  const salt: string = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function (): string {
  return jsonwebtoken.sign({ id: this.id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  let user = this as User;
  return await bcryptjs.compare(enteredPassword, user.password);
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function (): string {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  let user = this as User; // need to do this otherwise error: Property 'resetPasswordToken' does not exist on type 'Document<any>'

  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min

  return resetToken; // original token
};

// Exporting the model with an interface applied
const User = mongoose.model<User>('User', UserSchema);
export default User;
