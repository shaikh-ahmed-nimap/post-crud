import sequelize from "./config";

(async () => {
    await sequelize.sync();
})();
