import bcrypt from 'bcryptjs'

// HASHEAR contraseña
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10) // Genera "sal" aleatoria
  return await bcrypt.hash(password, salt) // Hashea con la sal
}

// COMPARAR contraseña
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}
