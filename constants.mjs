export const getCookieConfig = () => ({
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    path: '/',
  });