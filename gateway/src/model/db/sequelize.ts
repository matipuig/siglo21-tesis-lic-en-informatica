import { Sequelize } from 'sequelize';
import moment from 'moment';

import CONFIG from '~/config';

const { SQL } = CONFIG.DB;

const sequelize = new Sequelize(SQL.DATABASE, SQL.USER, SQL.PASSWORD, {
  host: SQL.HOST,
  dialect: 'mysql',
  timezone: moment().format('Z'),
  sync: {
    force: false,
  },
  pool: {
    max: 10,
    min: 1,
  },
  define: {
    charset: 'utf8',
    paranoid: false,
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : undefined,
});

export default sequelize;
