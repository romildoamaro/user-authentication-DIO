import User from "../models/user.model";
import db from "../db";
import DatabaseError from "../models/errors/database.error.model";

class UserRepository {
  async findUsers(): Promise<User[]> {
    const sql = `
            SELECT uuid, username FROM app_user
        `;

    const { rows } = await db.query<User>(sql);
    return rows || [];
  }

  async findById(uuid: string): Promise<User> {
    try {
      const sql = `
                SELECT uuid, username FROM app_user
                WHERE uuid = $1
            `;

      const values = [uuid];

      const { rows } = await db.query<User>(sql, values);
      const [user] = rows;

      return user;
    } catch (err) {
      throw new DatabaseError("Erro de consulta por ID", err);
    }
  }

  async findByUsernameAndPassword(
    username: string,
    password: string
  ): Promise<User | null> {
    try {
      const sql = `
        SELECT uuid, username FROM app_user
        WHERE username = $1
        AND password = crypt($2, 'my_salt')
        `;
      const values = [username, password];
      const { rows } = await db.query<User>(sql, values);
      const [user] = rows;

      return !user ? null : user;
    } catch (err) {
      throw new DatabaseError("Erro de consulta por username e password", err);
    }
  }

  async create(user: User): Promise<string> {
    const sql = `
            INSERT INTO app_user (
                username,
                password
            )
            VALUES ($1, crypt($2, 'my_salt'))
            RETURNING uuid
        `;

    const values = [user.username, user.password];

    const { rows } = await db.query<{ uuid: string }>(sql, values);
    const [newUser] = rows;

    return newUser.uuid;
  }

  async update(user: User): Promise<void> {
    const sql = `
            UPDATE app_user
            SET 
                username = $1,
                password = crypt($2, 'my_salt')
            WHERE uuid = $3    
        `;

    const values = [user.username, user.password, user.uuid];

    await db.query(sql, values);
  }

  async remove(uuid: string): Promise<void> {
    const sql = `
            DELETE FROM app_user
            WHERE uuid = $1
        `;
    const values = [uuid];

    await db.query(sql, values);
  }
}

export default new UserRepository();
