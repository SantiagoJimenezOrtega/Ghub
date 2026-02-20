// 20260213_create_birthdays_table.js
exports.up = async (knex) => {
  await knex.schema.createTable('birthdays', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('student_id').references('students.id').onDelete('CASCADE');
    table.integer('month').notNull();
    table.boolean('notified').defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('birthdays');
};