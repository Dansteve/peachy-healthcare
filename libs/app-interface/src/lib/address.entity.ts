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
  @Column({ nullable: true })
  search: string;

  // add a column for the postcode
  @Column({ nullable: true })
  postcode: string;

  // add a column for the latitude
  @Column({ nullable: true })
  latitude: number;

  // add a column for the longitude
  @Column({ nullable: true })
  longitude: number;

  // add a column for the thoroughfare
  @Column({ nullable: true })
  thoroughfare: string;

  // add a column for the building_name
  @Column({ nullable: true })
  building_name: string;

  // add a column for the sub_building_name
  @Column({ nullable: true })
  sub_building_name: string;

  // add a column for the sub_building_number
  @Column({ nullable: true })
  sub_building_number: string;

  // add a column for the building_number
  @Column({ nullable: true })
  building_number: string;

  // add a column for the line_1
  @Column({ nullable: true })
  line_1: string;

  // add a column for the line_2
  @Column({ nullable: true })
  line_2: string;

  // add a column for the line_3
  @Column({ nullable: true })
  line_3: string;

  // add a column for the line_4
  @Column({ nullable: true })
  line_4: string;

  // add a column for the locality
  @Column({ nullable: true })
  locality: string;

  // add a column for the town_or_city
  @Column({ nullable: true })
  town_or_city: string;

  // add a column for the county
  @Column({ nullable: true })
  county: string;

  // add a column for the district
  @Column({ nullable: true })
  district: string;

  // add a column for the country
  @Column({ nullable: true })
  country: string;

  // add a column for the residential
  @Column({ nullable: true })
  residential: boolean;

}
