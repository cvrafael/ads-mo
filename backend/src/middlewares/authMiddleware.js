import jwt from 'jsonwebtoken'

export async function authMiddleware(req, res, next) {
  const token = req.cookies.session
  if (!token) return res.sendStatus(401)

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    res.sendStatus(401)
  }
}


