import bcrypt from 'bcryptjs';

/**
 * Hash de contraseña usando bcrypt
 * @param password - Contraseña en texto plano
 * @returns Password hasheado
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

/**
 * Comparar contraseña con hash
 * @param password - Contraseña en texto plano
 * @param hashedPassword - Hash almacenado en BD
 * @returns true si coinciden, false si no
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

