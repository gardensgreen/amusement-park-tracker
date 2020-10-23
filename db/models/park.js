'use strict';
module.exports = (sequelize, DataTypes) => {
  const Park = sequelize.define('Park', {
    parkName: {
      type: DataTypes.STRING, 
      allowNull:false, 
      validate:{
        len:{
          args:[0, 255]
        }
      },
    },
    city:{
        type: DataTypes.STRING(100), 
      allowNull:false, 
      validate:{
        len:{
          args:[0, 100]
        }
      },
    },
    provinceState:{
        type: DataTypes.STRING(100), 
      allowNull:false, 
      validate:{
        len:{
          args:[0, 100]
        }
      },
    },
    country:{
      type: DataTypes.STRING(100), 
      allowNull:false, 
      validate:{
        len:{
          args:[0, 100]
        }
      },
    },

    opened:{
      type: DataTypes.DATEONLY,
      allowNull:false
    },
    size:{
        type: DataTypes.STRING(100), 
      allowNull:false, 
      validate:{
        len:{
          args:[0, 100]
        }
      },
    },
  
    description:{
      type: DataTypes.TEXT,
      allowNull:false
    } 
  }, {});
  Park.associate = function(models) {
    // associations can be defined here
  };
  return Park;
};