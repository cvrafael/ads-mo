'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
      await queryInterface.createTable('users', { 

          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,          
          },
          id_sub: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          email_verified: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
          },
          family_name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          given_name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          picture: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          is_admin: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
          },
          created_at: {
            type: Sequelize.TIME,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          }
          
        }
      
      );
    
      await queryInterface.createTable('posts', { 
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,          
          },
          title: {
            type: Sequelize.STRING,
            allowNull: false,  
          },
          description: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          image: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
          },
          website: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          payment_status: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          id_payment: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          status: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          premium: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
          },
          fk_id_user: {
            type: Sequelize.STRING,
            references: {
              model: 'users', // 'Movies' would also work
              key: 'id_sub',
            },
          },
          created_at: {
            type: Sequelize.TIME,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          }
          
        }
      
      );
     
      await queryInterface.createTable('likes', { 
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,          
          },
          like: {
            type: Sequelize.STRING,
            allowNull: false,  
          },
          fk_id_post: {
            type: Sequelize.INTEGER,
            references: {
              model: 'posts', // 'Movies' would also work
              key: 'id',
            },
          },
          fk_id_user: {
            type: Sequelize.STRING,
             references: {
              model: 'users', // 'Movies' would also work
              key: 'id_sub',
            },
          },
          created_at: {
            type: Sequelize.TIME,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          }
          
        }
      
      );
    
      await queryInterface.createTable('avatars', { 
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,          
          },
          image: {
            type: Sequelize.STRING,
            allowNull: true,  
          },
          fk_id_user: {
            type: Sequelize.STRING,
             references: {
              model: 'users', // 'Movies' would also work
              key: 'id_sub',
            },
          },
          created_at: {
            type: Sequelize.TIME,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          
        }
      
      );
     
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
