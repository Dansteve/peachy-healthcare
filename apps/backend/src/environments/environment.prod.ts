const urlNew = `postgresql://latadeigbodipe:kJSrhRdYLm21@ep-morning-glade-048740.us-east-2.aws.neon.tech/neondb`;

export const environment = {
  production: true,
  dbConfig: {
    type: 'postgres',
    ssl: true,
    url: urlNew,
    synchronize: true, //development only
  } as any
};
