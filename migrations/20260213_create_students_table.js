// 20260213_create_students_table.js
exports.up = async (knex) => {
  await knex.schema.createTable('students', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.text('nickname').notNull().unique();
    table.date('birthdate').notNull();
    table.text('photo_url');
    table.uuid('sticker_id');
    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('students');
};