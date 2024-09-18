export const generateCaptcha = (length = 6) => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";
  for (let i = 0; i < length; i++) {
    captcha += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return captcha;
};

