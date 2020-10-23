'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkInsert('Parks', [{
        parkName: 'Six Flags',
        city: 'Chicago',
        provinceState: 'Illinois',
        country:'USA',
        opened:new Date(),
        size:'1000000 sq ft',
        description: "its lit!",
        createdAt: new Date(),
        updatedAt: new Date(),
      }], {});
    
  },

  down: (queryInterface, Sequelize) => {
  

      return queryInterface.bulkDelete('Parks', null, {});
  }
};
