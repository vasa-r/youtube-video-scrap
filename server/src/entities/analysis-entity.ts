import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Video } from "./video-entity";

@Entity({ name: "analysis" })
export class Analysis {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "string" })
  summary: string;

  @Column({ type: "text", array: true })
  keyPoints: string[];

  @Column({
    type: "enum",
    enum: ["positive", "negative", "neutral"],
    default: "neutral",
  })
  sentiment: "positive" | "negative" | "neutral";

  @Column({ type: "text", array: true })
  topics: string[];

  @Column({ type: "text", array: true })
  tags: string[];

  @OneToOne(() => Video, (video) => video.analysis)
  @JoinColumn()
  video: Video;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
