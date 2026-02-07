'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /* =========================
       RUNINS
    ========================== */
    await queryInterface.createTable('runins', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      runin: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    /* =========================
       RACKS
    ========================== */
    await queryInterface.createTable('racks', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      fk_id_runin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'runins',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      rack: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // await queryInterface.addIndex('racks', ['fk_id_runin', 'rack'], {
    //   unique: true,
    //   name: 'racks_runin_number_unique',
    // });

    /* =========================
       POSITIONS
    ========================== */
    await queryInterface.createTable('positions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      fk_id_rack: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'racks',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      position: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('OK', 'NOK'),
        allowNull: false,
        defaultValue: 'OK',
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

  //   await queryInterface.addIndex('positions', ['fk_id_rack', 'position'], {
  //     unique: true,
  //     name: 'positions_rack_number_unique',
  //   });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('positions');
    await queryInterface.dropTable('racks');
    await queryInterface.dropTable('runins');

    // Remove ENUM manualmente (Postgres)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_positions_status";'
    );
  },
};
