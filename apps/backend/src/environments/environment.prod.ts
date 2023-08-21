const urlNew = `postgres://adekanbidansteve:w3MtIkc8VEzD@ep-autumn-tree-27299779.us-east-2.aws.neon.tech/neondb`;

export const environment = {
  production: true,
  dbConfig: {
    type: 'postgres',
    ssl: true,
    url: urlNew,
    synchronize: true, //development only
  } as any
};
