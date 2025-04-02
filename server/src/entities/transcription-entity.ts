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

@Entity({ name: "transcriptions" })
export class Transcription {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  text: string;

  @Column({ type: "float" })
  confidence: number;

  @Column({ type: "boolean" })
  isMusic: boolean;

  @Column({ type: "text", nullable: true })
  audioPath: string;

  @OneToOne(() => Video, (video) => video.transcription)
  @JoinColumn()
  video: Video;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
