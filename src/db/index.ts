import sequelize from "./config";

const syncTable = async (opt?: {alter?: boolean, force?: boolean}) => {
    await sequelize.sync(opt);
};

export default syncTable;