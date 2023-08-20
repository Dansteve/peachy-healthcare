import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BasedEntity } from "./base.entity";
import { User } from "./user.entity";

// create a new entity to represent a address

@Entity('address')
export class Address extends BasedEntity {

    @Column()
    @OneToOne(() => User, { nullable: false })
    @JoinColumn({ name: "userId", referencedColumnName: "id" })
    userId: string;

    // add a column for the search
    @Column()
    search: string;

    // add a column for the postcode
    @Column()
    postcode: string;

    // add a column for the latitude
    @Column()
    latitude: number;

    // add a column for the longitude
    @Column()
    longitude: number;

    // add a column for the thoroughfare
    @Column()
    thoroughfare: string;

    // add a column for the building_name
    @Column()
    building_name: string;

    // add a column for the sub_building_name
    @Column()
    sub_building_name: string;

    // add a column for the sub_building_number
    @Column()
    sub_building_number: string;

    // add a column for the building_number
    @Column()
    building_number: string;

    // add a column for the line_1
    @Column()
    line_1: string;

    // add a column for the line_2
    @Column()
    line_2: string;

    // add a column for the line_3
    @Column()
    line_3: string;

    // add a column for the line_4
    @Column()
    line_4: string;

    // add a column for the locality
    @Column()
    locality: string;

    // add a column for the town_or_city
    @Column()
    town_or_city: string;

    // add a column for the county
    @Column()
    county: string;

    // add a column for the district
    @Column()
    district: string;

    // add a column for the country
    @Column()
    country: string;

    // add a column for the residential
    @Column()
    residential: boolean;
}
