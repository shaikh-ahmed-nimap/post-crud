import { Dialect, Sequelize } from "sequelize";

console.log('DATABASE', process.env.MYSQL_DATABASE);
console.log('USERNAME', process.env.MYSQL_USERNAME);

const sequelize = new Sequelize(process.env.MYSQL_DATABASE as string,process.env.MYSQL_USERNAME as string,process.env.MYSQL_PASSWORD, {
    dialect: 'mysql'
});

(async function () {
    try {
        await sequelize.authenticate();
        console.log('Database conncection stablished');
    } catch (e) {
        console.log(e);
        throw e;
    }
})();

export default sequelize;