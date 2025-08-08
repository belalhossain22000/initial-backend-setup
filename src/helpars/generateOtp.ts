function generateOtp(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

export default generateOtp;
