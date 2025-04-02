import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user-entity";
import { Transcription } from "./transcription-entity";
import { Analysis } from "./analysis-entity";

@Entity({ name: "videos" })
export class Video {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  url: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ unsigned: true })
  duration: number;

  @Column()
  author: string;

  @Column({ type: "text", nullable: true })
  thumbnail: string;

  @Column({
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  })
  @Index()
  status: "pending" | "processing" | "completed" | "failed";

  @ManyToOne(() => User, (user) => user.videos, {
    nullable: false,
    onDelete: "CASCADE",
  })
  user: User;

  @OneToOne(() => Transcription, (transcription) => transcription.video)
  transcription: Transcription;

  @OneToOne(() => Analysis, (analysis) => analysis.video)
  analysis: Analysis;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
