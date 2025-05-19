import bcrypt from 'bcrypt'
import DBLocal from 'db-local'
import crypto from 'node:crypto'
import { SALT_ROUNDS } from '../config.js'
const {Schema} = new DBLocal({path:'./db'})

// Esquema de usuario
const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

export class UserRepository {
  static async create({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    // Esperamos la búsqueda para comprobar si existe el usuario
    const user = await User.findOne({ username })
    if (user) throw new Error('username already exists')

    const id = crypto.randomUUID()
    // Hasheamos la contraseña con await
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    // Creamos el usuario y esperamos a que se guarde
    await User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()

    return id
  }

  static async login({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    // Esperamos la búsqueda del usuario
    const user = await User.findOne({ username })
    if (!user) throw new Error('username does not exist')

    // Comparamos la contraseña con await
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new Error('password is invalid')

    // Retornamos el usuario sin la contraseña
    const { password: _, ...publicUser } = user
    return publicUser
  }
}

class Validation {
  static username(username) {
    if (typeof username !== 'string') throw new Error('username must be a string')
    if (username.length < 3) throw new Error('Username debe tener más de 3 caracteres')
  }
  static password(password) {
    if (typeof password !== 'string') throw new Error('password must be a string')
    if (password.length < 6) throw new Error('password debe tener más de 5 caracteres')
  }
}
