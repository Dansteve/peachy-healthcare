
// create a new entity to represent a user

export type GenderType = 'Male' | 'Female' | 'Non-Binary' | 'Other' | 'Prefer not to say';

import { Column, Entity, OneToOne } from "typeorm";
import { Address } from "./address.entity";
import { BasedEntity } from "./base.entity";

// create a new entity to represent a user

@Entity('user')
export class User extends BasedEntity {

    @Column({ nullable: true })
    userRef?: string;

    @Column({ nullable: false })
    firstName: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ nullable: false, unique: true })
    username: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true, unique: false })
    gender: GenderType;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ nullable: true })
    age: string;

    @Column({ nullable: true, default: null })
    otp?: string;

    // @Column()
    @OneToOne(() => Address, { nullable: true })
    // @JoinColumn({ name: "bankAccount", referencedColumnName: "id" })
    address?: any;

}





