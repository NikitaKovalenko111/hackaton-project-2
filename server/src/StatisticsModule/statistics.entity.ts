
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Statistics {
    @PrimaryGeneratedColumn()
    statistics_id: number;

    @Column()
    statistics_name: string;

    @Column()
    statistics_data: string

    constructor(item: Partial<Statistics>) {
        Object.assign(this, item)
    }
}