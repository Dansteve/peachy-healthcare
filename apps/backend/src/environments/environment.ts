// export const environment = {
//     production: false,
//     dbConfig: {
//         type: 'sqlite',
//         database: 'ewallet.db',
//         synchronize: true, //development only
//     } as any
// };

// const urlNew = `postgresql://latadeigbodipe:kJSrhRdYLm21@ep-morning-glade-048740.us-east-2.aws.neon.tech/neondb`;

// export const environment = {
//   production: true,
//   dbConfig: {
//     type: 'postgres',
//     ssl: true,
//     url: urlNew,
//     synchronize: true, //development only
//   } as any
// };


export const environment = {
    production: false,
    dbConfig: {
        type: 'sqlite',
      database: 'peachy-healthcare.db',
        synchronize: true, //development only
    } as any
};
