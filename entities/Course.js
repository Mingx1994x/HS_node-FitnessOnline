const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Course',
  tableName: 'COURSE',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
      nullable: false
    },
    user_id: {
      type: 'uuid',
      nullable: false,
      foreignKey: {
        name: 'course_user_id_fk',
        columnName: [`user_id`],
        referenceTableName: "USER",
        referenceColumnName: [`id`]
      }
    },
    skill_id: {
      type: 'uuid',
      nullable: false,
      foreignKey: {
        name: 'course_skill_id_fk',
        columnName: [`skill_id`],
        referenceTableName: "SKILL",
        referenceColumnName: [`id`]
      }
    },
    name: {
      type: 'varchar',
      length: 100,
      nullable: false
    },
    description: {
      type: 'text',
      nullable: false
    },
    start_at: {
      type: 'timestamp',
      nullable: false
    },
    end_at: {
      type: 'timestamp',
      nullable: false
    },
    max_participants: {
      type: 'integer',
      nullable: false
    },
    meeting_url: {
      type: 'varchar',
      length: 2048,
      nullable: false
    },
    create_at: {
      type: 'timestamp',
      createDate: true,
      nullable: false
    },
    update_at: {
      type: 'timestamp',
      updateDate: true,
      nullable: false
    }
  }
}) 