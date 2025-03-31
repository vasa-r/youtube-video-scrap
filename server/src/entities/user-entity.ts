import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import * as bcrypt from "bcryptjs";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 50, name: "user_name" })
  userName: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: "hashed_password" })
  hashedPassword: string;

  @Column({ default: false, name: "is_email_verified" })
  isEmailVerified: boolean;

  @Column({ nullable: true, type: "text", name: "email_verification_token" })
  emailVerificationToken: string | null;

  @Column({
    nullable: true,
    type: "timestamp",
    name: "email_verification_token_expires",
  })
  emailVerificationTokenExpires: Date | null;

  @Column({ nullable: true, name: "last_login" })
  lastLogin: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.hashedPassword && this.hashedPassword.length < 60) {
      this.hashedPassword = await bcrypt.hash(this.hashedPassword, 10);
    }
  }

  async comparePassword(inputPassword: string): Promise<boolean> {
    return bcrypt.compare(inputPassword, this.hashedPassword);
  }
}
