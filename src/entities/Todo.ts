import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "boolean", default: false })
  isComplete!: boolean;

  @ManyToOne(() => User, (user) => user.id, { eager: true, onDelete: "CASCADE" })
  user!: User;
}
